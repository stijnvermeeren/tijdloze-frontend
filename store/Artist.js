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
      firstName: this.attr(null),
      name: this.attr(null),
      countryId: this.attr(null),

      songs: this.hasMany(Song, 'artistId'),
      albums: this.hasMany(Album, 'artistId')
    };
  }

  get fullName() {
    return this.firstName ? `${this.firstName} ${this.name}` : this.name;
  }
}
