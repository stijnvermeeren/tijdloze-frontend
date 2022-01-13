import { Model } from '@vuex-orm/core'
import Song from "./Song";

export default class List extends Model {
  static get entity() {
    return 'lists';
  }

  static primaryKey = 'year'

  static fields() {
    return {
      year: this.attr(null),
      songIds: this.attr(null),
      songs: this.hasManyBy(Song, 'songIds')
    };
  }
}
