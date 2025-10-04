import { defineStore } from 'pinia'

import Year from '~/orm/Year';
import {YearsIndex} from '~/utils/yearContext';

export const useYearStore = defineStore('year', () => {
  const yearsRaw = ref([])

  const years = computed(() => {
    return yearsRaw.value?.map(yyyy => new Year(yyyy)) ?? []
  })
  const context = computed(() => {
    return new YearsIndex(years.value)
  })
  const currentYear = computed(() => {
    return years.value?.[years.value.length - 1]
  })
  const previousYear = computed(() => {
    return context.value.forYear(currentYear.value).previous?.year;
  })

  function setCurrentYear(currentYear) {
    if (yearsRaw.value?.[yearsRaw.value.length - 1] !== currentYear) {
      yearsRaw.value = yearsRaw.value.filter(year => year < currentYear)
      yearsRaw.value.push(currentYear)
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
