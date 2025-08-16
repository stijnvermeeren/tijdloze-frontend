<template lang="pug">
table.lijst.perVijf
  tbody
    tr
      th.r Jaar
      th Aantal
      th.l(colspan='3') Grootste stijger
    tr(v-for='{year, entries, topEntry} in listData')
      td.r
        year-link(:year='year')
      td {{entries.length}}
      td(v-if='topEntry')
        | {{topEntry.oldPosition - topEntry.newPosition}} posities
      td.i(v-if='topEntry')
        | {{topEntry.oldPosition}} &rarr; {{topEntry.newPosition}}
      td.l(v-if='topEntry')
        song-with-cover(:song='topEntry.song')
      td.l(v-if='!topEntry' colspan='4')
        | /
</template>

<script setup>
import _ from 'lodash'

const props = defineProps({
  data: Array,
  years: Array
})

const listData = computed(() => {
  const listYears = _.reverse(_.drop(props.years, 1));
  return listYears.map(year => {
    const entries = entriesPerYear(year);
    return {
      year,
      entries,
      topEntry: _.first(entries)
    }
  })
})

function entriesPerYear(year) {
  return _.sortBy(
    props.data.filter(entry => entry.year.equals(year)),
    [entry => entry.newPosition - entry.oldPosition, entry => entry.newPosition]
  );
}
</script>
