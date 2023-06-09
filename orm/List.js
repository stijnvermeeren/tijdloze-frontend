import { Model } from 'pinia-orm'
import Song from "./Song";

export default class List extends Model {
  static get entity() {
    return 'lists';
  }

  static primaryKey = 'year'

  static fields() {
    return {
      year: this.attr(null),
      songIds: this.attr([]),
      top100SongIds: this.attr([]),
      songs: this.hasManyBy(Song, 'songIds'),
      top100Songs: this.hasManyBy(Song, 'top100SongIds')
    };
  }
}
