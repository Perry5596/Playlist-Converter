import type { Playlist, Track } from '../db/models/Playlist';

export abstract class BaseScraper {
  abstract provider: 'spotify' | 'apple' | 'youtube' | 'soundcloud';

  /**
   * Validates if the given URL matches the provider's pattern
   */
  abstract validateUrl(url: string): boolean;

  /**
   * Extracts playlist ID or other identifiers from the URL
   */
  abstract extractIdentifiers(url: string): Promise<{ playlistId: string }>;

  /**
   * Scrapes playlist metadata and tracks
   */
  abstract scrapePlaylist(url: string): Promise<Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>>;

  /**
   * Searches for a track across different providers
   * This can be used to find matching tracks on other platforms
   */
  abstract searchTrack(track: Track): Promise<{
    spotify?: string;
    appleMusic?: string;
    youtubeMusic?: string;
    soundcloud?: string;
  }>;

  protected handleError(error: unknown, context: string): never {
    console.error(`Error in ${this.provider} scraper (${context}):`, error);
    throw new Error(`Failed to scrape ${this.provider} playlist: ${context}`);
  }
} 