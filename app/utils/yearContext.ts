import type Year from '~/orm/Year'

export class YearsIndex {
    years: Year[]
    private indexByYyyy: Record<number, number>

    constructor(years: Year[]) {
        this.years = years
        this.indexByYyyy = {}
        years.forEach((year, index) => {
            this.indexByYyyy[year.yyyy] = index
        })
    }

    forYear(year: Year): YearContext {
        return new YearContext(this, this.indexByYyyy[year.yyyy] ?? 0)
    }
}

class YearContext {
    private yearsIndex: YearsIndex
    private index: number

    constructor(yearsIndex: YearsIndex, index: number) {
        this.yearsIndex = yearsIndex
        this.index = index
    }

    get year(): Year {
        return this.yearsIndex.years[this.index]!
    }

    get previous(): YearContext | undefined {
        if (this.index > 0) {
            return new YearContext(this.yearsIndex, this.index - 1)
        }
    }

    get next(): YearContext | undefined {
        if (this.index + 1 < this.yearsIndex.years.length) {
            return new YearContext(this.yearsIndex, this.index + 1)
        }
    }
}