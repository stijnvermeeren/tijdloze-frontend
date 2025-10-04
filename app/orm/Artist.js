import { Model } from 'pinia-orm'
import Song from "./Song";
import Album from "./Album";
import { createSlug } from '~/utils/slug'
import { sortBy, sortWith, ascend } from 'ramda';

export default class Artist extends Model {
  static get entity() {
    return 'artists';
  }

  static fields() {
    return {
      id: this.attr(null),
      name: this.attr(null),
      aliases: this.attr(null),
      countryId: this.attr(null),

      songs: this.hasMany(Song, 'artistId'),
      secondarySongs: this.hasMany(Song, 'secondArtistId'),
      albums: this.hasMany(Album, 'artistId')
    };
  }

  get slug() {
    return createSlug(this.name)
  }

  get songsSorted() {
    return sortBy(song => song.title)(this.songs);
  }

  get allSongs() {
    return sortBy(song => song.title)(this.songs.concat(this.secondarySongs));
  }

  get allAlbums() {
    return sortWith([
      ascend(album => album.releaseYear),
      ascend(album => album.title)
    ])(this.albums.concat(this.secondarySongs.map(song => song.album)));
  }
}
