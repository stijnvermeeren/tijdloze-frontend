import { Model } from 'pinia-orm'
import Song from "./Song";
import Artist from "./Artist";
import { createSlug } from '~/utils/slug'
import { sortBy } from 'ramda';

export default class Album extends Model {
  static get entity() {
    return 'albums';
  }

  static fields() {
    return {
      id: this.attr(null),
      title: this.attr(null),
      artistId: this.attr(null),
      releaseYear: this.attr(null),
      cover: this.attr(null),
      isSingle: this.attr(false),
      isSoundtrack: this.attr(false),

      songs: this.hasMany(Song, 'albumId'),
      artist: this.belongsTo(Artist, 'artistId')
    };
  }

  get slug() {
    return createSlug(this.title)
  }

  get songsSorted() {
    return sortBy(song => song.title, this.songs)
  }
}
