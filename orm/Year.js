
import _ from "lodash";

export default class Year {
  previous = undefined;
  next = undefined;

  constructor(yyyy) {
    this.yyyy = yyyy;
    this.yy = yyyy.toString().substring(2,4);
    this._yy = `'${this.yy}`;
  }

  equals(year) {
    return year.yyyy === this.yyyy;
  }

  isCurrent() {
    return this.next === undefined;
  }
}
