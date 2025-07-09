import type { Track } from '../db/models/Playlist';

export interface CreatePlaylistOptions {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export abstract class BaseApiClient {
  abstract provider: 'spotify' | 'apple' | 'youtube' | 'soundcloud';

  /**
   * Authenticates with the provider's API
   */
  abstract authenticate(): Promise<void>;

  /**
   * Creates a new playlist
   */
  abstract createPlaylist(options: CreatePlaylistOptions): Promise<string>;

  /**
   * Adds tracks to a playlist
   */
  abstract addTracksToPlaylist(playlistId: string, tracks: Track[]): Promise<void>;

  /**
   * Searches for a track on the provider's platform
   */
  abstract searchTrack(track: Track): Promise<string | null>;

  protected handleError(error: unknown, context: string): never {
    console.error(`Error in ${this.provider} API (${context}):`, error);
    throw new Error(`${this.provider} API error: ${context}`);
  }
} 