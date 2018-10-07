import { Model } from '@vuex-orm/core'
import Song from "./Song";
import Artist from "./Artist";

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
}
