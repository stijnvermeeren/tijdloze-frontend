<template lang="pug">
table.lijst.perVijf
  tbody
    tr
      th
      th Jaar
      th.a Artiest
      th Nummer
      th(colspan='2') Gedaald
    tr(v-for='{entry, position} in ranking')
      td.r {{position}}
      td
        year-link(:year='entry.year')
      td.a
        song-artist-link(:song='entry.song')
      td
        song-link(:song='entry.song')
      td {{entry.newPosition - entry.oldPosition}} posities
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
          ({oldPosition, newPosition}) => oldPosition - newPosition,
          [({newPosition}) => newPosition, ({year}) => year.yyyy],
          50
        );
      }
    }
  }
</script>
