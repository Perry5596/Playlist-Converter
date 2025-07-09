# Plan

> The current structure plan for the backend

```
| api/
|----- base.ts          # Base API client class
|----- spotify.ts       # Spotify specific API client
|----- apple.ts         # Apple specific API client
|----- youtube.ts       # Youtube specific API client
|----- soundcloud.ts    # SoundCloud specific API client
| db/models/
|----- Playlist.ts      # Database models for playlists and tracks
| scrapers/
|----- base.ts          # Base scraper class
|----- spotify.ts       # Spotify specific scraper
|----- apple.ts         # Apple specific scraper
|----- youtube.ts       # Youtube specific scraper
|----- soundcloud.ts    # SoundCloud specific scraper
| services/
|----- converter.ts     # Main conversion service
|----- index.ts         # Service exports

```