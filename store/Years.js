import _ from 'lodash'

export default class Years {
  constructor(years) {
    this.years = years;
  }

  currentYear() {
    return _.last(this.years);
  }

  plusYears(year, delta) {
    const index = _.findIndex(this.years, otherYear => year.equals(otherYear));
    console.log(year, index);
    return this.years[index + delta];
  }

  previousYear(year) {
    year = year || this.currentYear();
    return this.plusYears(year, -1);
  }

  nextYear(year) {
    year = year || this.currentYear();
    return this.plusYears(year, -1);
  }
}
