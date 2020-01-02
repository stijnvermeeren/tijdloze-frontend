import { Model } from '@vuex-orm/core'
import Song from "./Song";
import Album from "./Album";
import { createSlug } from '~/utils/slug'
import _ from 'lodash'

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

  get slug() {
    return createSlug(this.fullName)
  }

  get fullName() {
    return this.namePrefix ? `${this.namePrefix} ${this.name}` : this.name;
  }

  get songsSorted() {
    return _.sortBy(
      this.songs,
      song => song.title
    );
  }

  get allSongs() {
    return _.sortBy(
      this.songs.concat(this.secondarySongs),
      song => song.title
    );
  }

  get allAlbums() {
    return _.sortBy(
      this.albums.concat(this.secondarySongs.map(song => song.album)),
      [album => album.releaseYear, album => album.title]
    );
  }
}
