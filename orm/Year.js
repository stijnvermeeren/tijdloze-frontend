
import _ from "lodash";

export default class Year {
  constructor(yyyy) {
    this.yyyy = yyyy;
    this.yy = yyyy.toString().substring(2,4);
    this._yy = `'${this.yy}`;
    this.previous = undefined;
    this.next = undefined;
  }

  equals(year) {
    return year.yyyy === this.yyyy;
  }

  isCurrent() {
    return this.next === undefined;
  }
}
