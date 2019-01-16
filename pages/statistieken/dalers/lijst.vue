<template lang="pug">
  table.lijst.perVijf
    tbody
      tr
        th
        th Jaar
        th.a
          nuxt-link(to='/artiesten') Artiest
        th
          nuxt-link(to='/nummers') Nummer
        th(colspan='2') Gedaald
      tr(v-for='{entry, position} in ranking')
        td.r {{position}}
        td
          tijdloze-year(:year='entry.year')
        td.a
          tijdloze-artist(:artist='entry.song.artist')
        td
          tijdloze-song(:song='entry.song')
        td {{entry.newPosition - entry.oldPosition}} posities
        td.i {{entry.oldPosition}} &rarr; {{entry.newPosition}}
</template>

<script>
  import ranking from '../../../store/ranking';

  export default {
    props: ['data', 'years'],
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
