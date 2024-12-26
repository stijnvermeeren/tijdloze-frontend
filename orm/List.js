import { Model } from 'pinia-orm'

export default class List extends Model {
  static get entity() {
    return 'lists';
  }

  static primaryKey = 'year'

  static fields() {
    return {
      year: this.attr(null),
      songIds: this.attr(null)
    };
  }
}
