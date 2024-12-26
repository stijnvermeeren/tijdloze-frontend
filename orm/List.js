import { Model } from 'pinia-orm'
import Song from "./Song";
import ListEntry from "~/orm/ListEntry";

export default class List extends Model {
  static get entity() {
    return 'lists';
  }

  static primaryKey = 'year'

  static fields() {
    return {
      year: this.attr(null),
      entryIds: this.attr([]),
      entries: this.hasManyBy(ListEntry, 'entryIds')
    };
  }
}
