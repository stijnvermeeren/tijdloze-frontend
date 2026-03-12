import { Model } from 'pinia-orm'
import type { ModelFields } from 'pinia-orm'
import Song from './Song'
import Album from './Album'
import { createSlug } from '~/utils/slug'
import { sortBy, sortWith, ascend } from 'ramda'

export default class Artist extends Model {
  declare id: number
  declare name: string
  declare aliases: string | null
  declare countryId: string | null

  declare songs: Song[]
  declare secondarySongs: Song[]
  declare albums: Album[]

  static override get entity(): string {
    return 'artists'
  }

  static override fields(): ModelFields {
    return {
      id: this.attr(null),
      name: this.attr(null),
      aliases: this.attr(null),
      countryId: this.attr(null),

      songs: this.hasMany(Song, 'artistId'),
      secondarySongs: this.hasMany(Song, 'secondArtistId'),
      albums: this.hasMany(Album, 'artistId')
    }
  }

  get slug(): string {
    return createSlug(this.name)
  }

  get songsSorted(): Song[] {
    return sortBy((song: Song) => song.title, this.songs)
  }

  get allSongs(): Song[] {
    return sortBy((song: Song) => song.title, this.songs.concat(this.secondarySongs))
  }

  get allAlbums(): Album[] {
    return sortWith([
      ascend((album: Album) => album.releaseYear),
      ascend((album: Album) => album.title)
    ], this.albums.concat(this.secondarySongs.map(song => song.album)))
  }
}
