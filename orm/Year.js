
import _ from "lodash";

export default class Year {
  constructor(yyyy, yearsRaw) {
    this.yyyy = yyyy;
    this.yy = yyyy.toString().substring(2,4);
    this._yy = `'${this.yy}`;

    this.yearsRaw = yearsRaw;
    this.yearsIndex = _.findIndex(yearsRaw, otherYYYY => otherYYYY === yyyy);
  }

  equals(year) {
    return year.yyyy === this.yyyy;
  }

  isCurrent() {
    return this.yearsIndex === this.yearsRaw.length - 1;
  }

  plus(delta) {
    const yyyy = this.yearsRaw[this.yearsIndex + delta];
    return yyyy ? new Year(yyyy, this.yearsRaw) : null;
  }

  previous() {
    return this.plus(-1);
  }

  next() {
    return this.plus(1);
  }
}
