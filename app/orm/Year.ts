export default class Year {
  yyyy: number
  yy: string
  _yy: string

  constructor(yyyy: number) {
    this.yyyy = yyyy
    this.yy = yyyy.toString().substring(2, 4)
    this._yy = `'${this.yy}`
  }

  equals(year: Year): boolean {
    return year.yyyy === this.yyyy
  }
}
