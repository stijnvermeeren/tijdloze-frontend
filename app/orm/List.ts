import { Model } from 'pinia-orm'
import type { ModelFields } from 'pinia-orm'

export default class List extends Model {
  declare year: number
  declare songIds: Array<number | null>
  declare attributions: Record<number, string> | null

  static override get entity(): string {
    return 'lists'
  }

  static override primaryKey = 'year'

  static override fields(): ModelFields {
    return {
      year: this.attr(null),
      songIds: this.attr(null),
      attributions: this.attr(null)
    }
  }
}
