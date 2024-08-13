import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
from dotenv import load_dotenv

# NOTE: PUT URL HERE
url = 'https://music.apple.com/us/playlist/your_playlist_url_here'

# Set up Selenium WebDriver
options = Options()
options.headless = True
service = Service('C:\\Program Files\\Google\\chromedriver-win64\\chromedriver.exe')  # Path to your WebDriver executable
driver = webdriver.Chrome(service=service, options=options)

driver.get(url)
time.sleep(5)

# Get the page source and parse it with BeautifulSoup
soup = BeautifulSoup(driver.page_source, 'html.parser')
driver.quit()  # Close the browser

songs = soup.find_all('div', class_='songs-list-row__song-name')
artists = soup.find_all('div', class_='songs-list-row__by-line')

# Debug: Print the raw extracted song and artist elements
print("Raw Songs Elements:", songs)
print("Raw Artists Elements:", artists)

playlist = []
for song, artist in zip(songs, artists):
    title = song.text.strip()
    artist_name = artist.text.strip()
    playlist.append({'title': title, 'artist': artist_name})

# Debug: Print the extracted playlist
print("Extracted Playlist:")
for song in playlist:
    print(f"Title: {song['title']}, Artist: {song['artist']}")

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
playlist_spotify = sp.user_playlist_create(user=user_id, name="New Playlist", public=True)

# Search for each song and add to the Spotify playlist
track_ids = []
for song in playlist:
    query = f"{song['title']} {song['artist']}"
    results = sp.search(q=query, type='track', limit=1)
    if results['tracks']['items']:
        track_ids.append(results['tracks']['items'][0]['id'])
    else:
        print(f"Song not found: {song['title']} by {song['artist']}")

print("Track IDs:")
print(track_ids)

# Spotify API allows adding up to 100 tracks per request, split track_ids into chunks of 100
def chunks(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

track_chunks = list(chunks(track_ids, 100))

for chunk in track_chunks:
    sp.user_playlist_add_tracks(user_id, playlist_spotify['id'], chunk)
    print(f"Added {len(chunk)} tracks to the playlist.")

print("Playlist transfer complete.")