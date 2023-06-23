<template lang="pug">
table.lijst.perVijf
  tbody
    tr
      th
      th Jaar
      th.l Nummer
      th(colspan='2') Gestegen
    tr(v-for='{entry, position} in ranking')
      td.r {{position}}
      td
        year-link(:year='entry.year')
      td.l
        song-with-cover(:song='entry.song')
      td {{entry.oldPosition - entry.newPosition}} posities
      td.i {{entry.oldPosition}} &rarr; {{entry.newPosition}}
</template>

<script>
  import ranking from '~/utils/ranking';

  export default {
    props: {
      data: Array,
      years: Array
    },
    computed: {
      ranking() {
        return ranking(
          this.data,
          ({oldPosition, newPosition}) => newPosition - oldPosition,
          [({newPosition}) => newPosition, ({year}) => year.yyyy],
          50
        );
      }
    }
  }
</script>
