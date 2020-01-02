import { Model } from '@vuex-orm/core'
import Song from "./Song";
import Artist from "./Artist";
import { createSlug } from '~/utils/slug'
import _ from 'lodash'

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

      songs: this.hasMany(Song, 'albumId'),
      artist: this.belongsTo(Artist, 'artistId')
    };
  }

  get slug() {
    return createSlug(this.title)
  }

  get songsSorted() {
    return _.sortBy(
      this.songs,
      [song => song.title]
    )
  }
}
