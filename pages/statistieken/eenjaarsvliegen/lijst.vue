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
        th Plaats
        th Definitief
      tr(v-for='{entry, position} in ranking')
        td.r {{position}}
        td
          tijdloze-year(:year='entry.year')
        td.a
          tijdloze-song-artist(:song='entry.song')
        td
          tijdloze-song(:song='entry.song')
        td {{entry.song.position(entry.year)}}
        td
          template(v-if='entry.isFinal') *
</template>

<script>
  import ranking from '../../../store/ranking';

  export default {
    props: ['data', 'years'],
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
