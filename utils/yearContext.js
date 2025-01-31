export class YearsIndex {
    constructor(years) {
        this.years = years;
        this.indexByYyyy = {};
        years.forEach((year, index) => {
            this.indexByYyyy[year.yyyy] = index
        })
    }
    forYear(year) {
      return new YearContext(this, this.indexByYyyy[year.yyyy])
    }
}

class YearContext {
    constructor(yearsIndex, index) {
        this.yearsIndex = yearsIndex;
        this.index = index
    }
    get year() {
        return this.yearsIndex.years[this.index]
    }
    get previous() {
        if (this.index > 0) {
            return new YearContext(this.yearsIndex, this.index - 1)
        }
    }
    get next() {
        if (this.index + 1 < this.yearsIndex.years.length) {
            return new YearContext(this.yearsIndex, this.index + 1)
        }
    }
}