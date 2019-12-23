<template lang="pug">
  span
    span(v-if='listCount')
      | {{listCount}} {{listCount > 1 ? 'noteringen' : 'notering' }}
      | ({{inListSummary}})
    span(v-else) Geen top-100 noteringen
</template>

<script>
  import {probablyInListIntervals} from '~/utils/intervals'
  import _ from 'lodash'

  export default {
    name: 'EntryCount',
    props: ['songs'],
    computed: {
      years() {
        return this.$store.getters.years;
      },
      listCount() {
        return _.sumBy(this.songs, song => song.listCount(this.years))
      },
      inListSummary() {
        const intervalSummaries = probablyInListIntervals(this.songs, this.years).map(interval => {
          const first = _.first(interval);
          const last = _.last(interval);
          if (last.isCurrent()) {
            return `${first.yyyy}-...`
          } else if (first.equals(last)) {
            return first.yyyy
          } else {
            return `${first.yyyy}-${last._yy}`
          }
        });
        return intervalSummaries.join(", ");
      }
    },
  }
</script>

<style scoped>

</style>
