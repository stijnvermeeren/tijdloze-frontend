import { Model } from 'pinia-orm'
import type { ModelFields } from 'pinia-orm'

export default class List extends Model {
  declare year: number
  declare songIds: Array<number | undefined>
  declare attributions: Record<number, string>

  static override get entity(): string {
    return 'lists'
  }

  static override primaryKey = 'year'

  static override fields(): ModelFields {
    return {
      year: this.attr(undefined),
      songIds: this.attr([]),
      attributions: this.attr({})
    }
  }
}
