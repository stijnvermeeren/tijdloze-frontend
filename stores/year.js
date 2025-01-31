import { defineStore } from 'pinia'
import { useRepo } from 'pinia-orm'
import _ from 'lodash';

import Artist from '~/orm/Artist';
import Song from '~/orm/Song';
import Year from '~/orm/Year';
import List from '~/orm/List';

export const useYearStore = defineStore('year', () => {
  const yearsRaw = ref([])

  const years = computed(() => {
    const years = yearsRaw.value?.map(yyyy => new Year(yyyy)) ?? []
    years.forEach((year, i) => {
      year.previous = years?.[i - 1]
      year.next = years?.[i + 1]
    })
    return years ?? []
  })
  const currentYear = computed(() => {
    return _.last(years.value)
  })
  const previousYear = computed(() => {
    return currentYear.value.previous;
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
    currentYear,
    previousYear,
    setCurrentYear,
    setYearsRaw,
    years
  }
})
