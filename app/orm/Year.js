
export default class Year {
  constructor(yyyy) {
    this.yyyy = yyyy;
    this.yy = yyyy.toString().substring(2,4);
    this._yy = `'${this.yy}`;
  }

  equals(year) {
    return year.yyyy === this.yyyy;
  }
}
