import { Model } from '@vuex-orm/core'
import Song from "./Song";
import Album from "./Album";

export default class Artist extends Model {
  static get entity() {
    return 'artists';
  }

  static fields() {
    return {
      id: this.attr(null),
      namePrefix: this.attr(null),
      name: this.attr(null),
      countryId: this.attr(null),

      songs: this.hasMany(Song, 'artistId'),
      secondarySongs: this.hasMany(Song, 'secondArtistId'),
      albums: this.hasMany(Album, 'artistId')
    };
  }

  get fullName() {
    return this.namePrefix ? `${this.namePrefix} ${this.name}` : this.name;
  }

  get allSongs() {
    return this.songs.concat(this.secondarySongs);
  }

  get allAlbums() {
    return this.albums.concat(this.secondarySongs.map(song => song.album));
  }
}
