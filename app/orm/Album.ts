import { Model } from 'pinia-orm'
import type { ModelFields } from 'pinia-orm'
import Song from './Song'
import Artist from './Artist'
import { createSlug } from '~/utils/slug'
import { sortBy } from 'ramda'

export default class Album extends Model {
  declare id: number
  declare title: string
  declare artistId: number
  declare releaseYear: number
  declare cover: string | null
  declare isSingle: boolean
  declare isSoundtrack: boolean

  declare songs: Song[]
  declare artist: Artist

  static override get entity(): string {
    return 'albums'
  }

  static override fields(): ModelFields {
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
    }
  }

  get slug(): string {
    return createSlug(this.title)
  }

  get songsSorted(): Song[] {
    return sortBy((song: Song) => song.title, this.songs)
  }
}
