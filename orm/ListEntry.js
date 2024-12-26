import { Model } from 'pinia-orm'
import Song from "./Song";
import Artist from "~/orm/Artist";

export default class ListEntry extends Model {
  static get entity() {
    return 'list_entries';
  }

  static primaryKey = 'yearPosition'

  static fields() {
    return {
      yearPosition: this.attr(null),
      position: this.attr(null),
      songId: this.attr(null),
      song: this.belongsTo(Song, 'songId'),
    };
  }
}
