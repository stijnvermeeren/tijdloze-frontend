<template lang="pug">
table.lijst.perVijf
  tbody
    tr
      th
      th Jaar
      th.l Nummer
      th Plaats
    tr(v-for='{entry, position} in ranking')
      td.r {{position}}
      td
        year-link(:year='entry.year')
      td.l
        song-with-cover(:song='entry.song')
      td {{entry.song.position(entry.year)}}
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
          ({song, year}) => song.position(year),
          ({year}) => year.yyyy,
          50
        );
      }
    }
  }
</script>
