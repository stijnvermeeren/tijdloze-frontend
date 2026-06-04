import { defineStore } from 'pinia'

import Year from '~/orm/Year';
import {YearsIndex} from '~/utils/yearContext';

export const useYearStore = defineStore('year', () => {
  const yearsRaw = ref<number[]>([])

  const years = computed<Year[]>(() => {
    return yearsRaw.value.map(yyyy => new Year(yyyy))
  })
  const context = computed<YearsIndex>(() => {
    return new YearsIndex(years.value)
  })
  const currentYear = computed<Year | undefined>(() => {
    return years.value[years.value.length - 1]
  })
  const previousYear = computed<Year | undefined>(() => {
    if (!currentYear.value) {
      return undefined
    }
    return context.value.forYear(currentYear.value).previous?.year;
  })

  function setCurrentYear(nextCurrentYear: number): void {
    if (yearsRaw.value?.[yearsRaw.value.length - 1] !== nextCurrentYear) {
      yearsRaw.value = yearsRaw.value.filter(year => year < nextCurrentYear)
      yearsRaw.value.push(nextCurrentYear)
    }
  }
    
  return {
    context,
    currentYear,
    previousYear,
    setCurrentYear,
    yearsRaw,  // needs to be exposed for hydration, see https://github.com/vuejs/pinia/discussions/2175
    years
  }
})
