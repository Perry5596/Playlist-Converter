import time
from selenium import webdriver
from selenium.webdriver import ActionChains, Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
from dotenv import load_dotenv
from webdriver_manager.chrome import ChromeDriverManager

# NOTE: PUT URL HERE
url = 'https://music.apple.com/us/playlist/your-playlist-url-here'

# Set up Selenium WebDriver
options = Options()
options.headless = False
options.add_argument("--window-size=1920,1080")
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)

print(f"Fetching playlist from: {url}")
driver.get(url)
time.sleep(5)  # Initial wait for page to load

# Extract playlist name from HTML
try:
    title_element = driver.find_element(By.CLASS_NAME, "headings__title")
    playlist_name = title_element.find_element(By.TAG_NAME, "span").text
    print(f"Playlist name: {playlist_name}")
except Exception as e:
    print(f"Could not extract playlist name: {e}")
    playlist_name = "New Playlist"

print("Scrolling to load all songs...")
initial_count = len(driver.find_elements(By.CLASS_NAME, 'songs-list-row__song-name'))
print(f"Initial song count: {initial_count}")

# Create ActionChains object for keyboard scrolling
actions = ActionChains(driver)

# Store the original URL to check for navigation issues
original_url = driver.current_url
print(f"Original URL: {original_url}")

# Continuously scroll until no more songs load
max_attempts = 100
consecutive_same_count = 0
previous_count = initial_count
current_count = initial_count
attempt = 0

print("Starting visible scrolling...")
while attempt < max_attempts and consecutive_same_count < 5:
    attempt += 1
    
    # Check if we're still on the playlist page
    current_url = driver.current_url
    if current_url != original_url:
        print(f"WARNING: Navigation occurred to {current_url}. Returning to playlist page.")
        driver.get(original_url)
        time.sleep(3)
    
    # Ultra-simple scrolling - just Page Down repeatedly
    try:
        # Get the body element and send Page Down keys
        body = driver.find_element(By.TAG_NAME, "body")
        
        # Send multiple Page Down keys
        for i in range(10):
            body.send_keys(Keys.PAGE_DOWN)
            time.sleep(0.5)  # Wait between each Page Down
            print(f"  Page Down {i+1}/10")
        
        print(f"Completed 10 Page Down presses for attempt {attempt}")
        
    except Exception as e:
        print(f"Page Down scrolling failed: {e}")
        # Fallback to JavaScript if Page Down fails
        try:
            for i in range(5):
                driver.execute_script("window.scrollBy(0, 800);")
                time.sleep(0.5)
                print(f"  JS scroll {i+1}/5")
        except Exception as e2:
            print(f"JavaScript fallback also failed: {e2}")
    
    # Wait for content to load
    print("Waiting for content to load...")
    time.sleep(3)
    
    # Check current count
    current_count = len(driver.find_elements(By.CLASS_NAME, 'songs-list-row__song-name'))
    print(f"Attempt {attempt}: Found {current_count} songs")
    
    # Check if we've loaded more songs
    if current_count > previous_count:
        print(f"SUCCESS: Loaded {current_count - previous_count} more songs")
        previous_count = current_count
        consecutive_same_count = 0  # Reset counter
    else:
        consecutive_same_count += 1
        print(f"No new songs loaded. Consecutive attempts: {consecutive_same_count}/5")

print(f"Finished scrolling after {attempt} attempts. Final song count: {current_count}")

# Check if we're still on the correct page
if driver.current_url != original_url:
    print(f"Navigation occurred to {driver.current_url}. Returning to playlist page for extraction.")
    driver.get(original_url)
    time.sleep(3)

# Get the page source and parse it with BeautifulSoup
soup = BeautifulSoup(driver.page_source, 'html.parser')

songs = soup.find_all('div', class_='songs-list-row__song-name')
artists = soup.find_all('div', class_='songs-list-row__by-line')

driver.quit()  # Close the browser

# Debug: Print the raw extracted song and artist elements
print(f"Number of songs found: {len(songs)}")
print(f"Number of artists found: {len(artists)}")

playlist = []
for song, artist in zip(songs, artists):
    title = song.text.strip()
    artist_name = artist.text.strip()
    playlist.append({'title': title, 'artist': artist_name})

# Debug: Print the extracted playlist
print(f"\nTotal tracks extracted from Apple Music: {len(playlist)}")

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = 'http://localhost/'

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=CLIENT_ID,
                                               client_secret=CLIENT_SECRET,
                                               redirect_uri=REDIRECT_URI,
                                               scope="playlist-modify-public"))

# Create a new playlist on Spotify
user_id = sp.current_user()['id']
playlist_spotify = sp.user_playlist_create(user=user_id, name=playlist_name, public=True)

# Search for each song and add to the Spotify playlist
track_ids = []
not_found_count = 0
print(f"\nSearching for {len(playlist)} songs on Spotify...")

for index, song in enumerate(playlist):
    query = f"{song['title']} {song['artist']}"
    results = sp.search(q=query, type='track', limit=1)
    if results['tracks']['items']:
        track_ids.append(results['tracks']['items'][0]['id'])
    else:
        not_found_count += 1
        print(f"Song not found: {song['title']} by {song['artist']}")
    
    # Progress indicator for large playlists
    if (index + 1) % 50 == 0:
        print(f"Processed {index + 1}/{len(playlist)} songs...")

print(f"\nFound {len(track_ids)} tracks on Spotify")
print(f"Could not find {not_found_count} tracks")

# Spotify API allows adding up to 100 tracks per request, split track_ids into chunks of 100
def chunks(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

track_chunks = list(chunks(track_ids, 100))
print(f"\nSplitting {len(track_ids)} tracks into {len(track_chunks)} chunks")

for i, chunk in enumerate(track_chunks):
    try:
        sp.user_playlist_add_tracks(user_id, playlist_spotify['id'], chunk)
        print(f"Added chunk {i+1}/{len(track_chunks)}: {len(chunk)} tracks to the playlist.")
    except Exception as e:
        print(f"Error adding chunk {i+1}: {str(e)}")
        # Try again with smaller chunks if there's an error
        smaller_chunks = list(chunks(chunk, 50))
        print(f"Retrying with {len(smaller_chunks)} smaller chunks of 50 tracks each")
        for j, small_chunk in enumerate(smaller_chunks):
            try:
                sp.user_playlist_add_tracks(user_id, playlist_spotify['id'], small_chunk)
                print(f"  - Added smaller chunk {j+1}/{len(smaller_chunks)}: {len(small_chunk)} tracks")
            except Exception as e2:
                print(f"  - Error adding smaller chunk {j+1}: {str(e2)}")

print("Playlist transfer complete.")
print(f"Successfully processed {len(track_ids)} tracks from {len(playlist)} original songs.")