# Playlist Converter

[![Python Version](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/downloads/release/python-380/)
[![Selenium](https://img.shields.io/badge/Selenium-4.0%2B-brightgreen.svg)](https://www.selenium.dev/documentation/webdriver/)
[![BeautifulSoup](https://img.shields.io/badge/BeautifulSoup-4.9.3-orange.svg)](https://www.crummy.com/software/BeautifulSoup/)
[![Spotify API](https://img.shields.io/badge/Spotify-API-brightgreen.svg)](https://developer.spotify.com/documentation/web-api/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](https://opensource.org/licenses/MIT)

## Overview

This project provides a Python script that automates the process of transferring playlists from Apple Music to Spotify. The script uses Selenium to scrape playlist data from Apple Music and the Spotipy library to create and populate a new playlist on Spotify.

## Features

- **Headless Scraping:** Utilizes Selenium in headless mode to efficiently scrape data from Apple Music.
- **Playlist Transfer:** Automatically creates a new Spotify playlist and adds the corresponding tracks.
- **Error Handling:** Notifies if a song cannot be found on Spotify.
- **Modular Design:** Easy to customize for additional features or different use cases.

## Prerequisites

- **Python 3.8+**
- **Spotify Developer Account**
- **Apple Music Account**
- **Google Chrome and ChromeDriver**

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Perry5596/Playlist-Converter.git
    cd apple-music-to-spotify
    ```

2. **Set up a virtual environment:**

    ```bash
    python -m venv venv
    source venv/bin/activate   # On Windows use `venv\Scripts\activate`
    ```

3. **Install the dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Set up Spotify API credentials:**

    - Create a `.env` file in the project root and add your Spotify API credentials:
    ```plaintext
    CLIENT_ID=your_spotify_client_id
    CLIENT_SECRET=your_spotify_client_secret
    ```

    - Make sure to replace `your_spotify_client_id` and `your_spotify_client_secret` with your actual Spotify credentials.

5. **Download and set up ChromeDriver:**

    - Download [ChromeDriver](https://sites.google.com/chromium.org/driver/) and ensure it matches your Chrome version.
    - Update the path to the ChromeDriver executable in the script:
    ```python
    service = Service('path/to/your/chromedriver')
    ```

## Usage

1. **Edit the script:**
    - Replace the placeholder URL in the script with the Apple Music playlist URL you want to transfer:
    ```python
    url = 'https://music.apple.com/us/playlist/your_playlist_url_here'
    ```

2. **Run the script:**

    ```bash
    python applemusic_to_spotify.py
    ```

3. **Check your Spotify account:**
    - A new playlist should be created with the transferred songs.

## Debugging

- **Raw Data Printing:** The script prints out the raw extracted song and artist elements for debugging purposes.
- **Error Messages:** If a song is not found on Spotify, it is logged in the console.

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to customize this script and improve its functionalities. Contributions are always welcome!
