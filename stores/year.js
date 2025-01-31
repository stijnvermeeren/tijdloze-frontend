import { defineStore } from 'pinia'
import _ from 'lodash';

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
    return _.last(years.value)
  })
  const previousYear = computed(() => {
    return context.value.forYear(currentYear.value).previous?.year;
  })

  function setCurrentYear(currentYear) {
    if (_.last(yearsRaw.value) !== currentYear) {
      yearsRaw.value = yearsRaw.value.filter(year => year < currentYear)
      yearsRaw.value.push(currentYear)
    }
  }

  function setYearsRaw(data) {
    yearsRaw.value = data;
  }
    
  return {
    context,
    currentYear,
    previousYear,
    setCurrentYear,
    setYearsRaw,
    years
  }
})
