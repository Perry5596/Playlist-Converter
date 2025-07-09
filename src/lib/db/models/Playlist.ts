export interface Track {
  title: string;
  artist: string;
  isrc: string;
  platform: 'spotify' | 'apple' | 'youtube' | 'soundcloud';
}

export interface Playlist {
  id: string;
  name: string;
  platform: 'spotify' | 'apple' | 'youtube' | 'soundcloud';
  tracks: Track[];
  createdAt: Date;
  updatedAt: Date;
}

// Simple in-memory implementation
export class PlaylistModel {
  private playlists: Map<string, Playlist> = new Map();

  async create(data: {
    name: string;
    platform: Playlist['platform'];
    tracks: Track[];
  }): Promise<Playlist> {
    const id = crypto.randomUUID();
    const now = new Date();

    const playlist: Playlist = {
      id,
      name: data.name,
      platform: data.platform,
      tracks: data.tracks,
      createdAt: now,
      updatedAt: now
    };

    this.playlists.set(id, playlist);
    return playlist;
  }

  async findById(id: string): Promise<Playlist | null> {
    return this.playlists.get(id) || null;
  }

  async update(id: string, updates: Partial<Omit<Playlist, 'id' | 'createdAt'>>): Promise<Playlist> {
    const playlist = await this.findById(id);
    if (!playlist) {
      throw new Error(`Playlist with id ${id} not found`);
    }

    const updatedPlaylist: Playlist = {
      ...playlist,
      ...updates,
      updatedAt: new Date()
    };

    this.playlists.set(id, updatedPlaylist);

    return updatedPlaylist;
  }

  async delete(id: string): Promise<void> {
    const playlist = this.playlists.get(id);
    if (playlist) {
      this.playlists.delete(id);
    }
  }

  // Helper method to find playlists containing a track by ISRC
  async findPlaylistsByTrackIsrc(isrc: string): Promise<Playlist[]> {
    return Array.from(this.playlists.values())
      .filter(playlist => playlist.tracks.some(track => track.isrc === isrc));
  }
} 