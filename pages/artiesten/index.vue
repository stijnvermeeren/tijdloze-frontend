<template lang="pug">
  div
    h2 Alle Tijdloze artiesten
    table.lijst.perVijf
      tbody
        tr
          th Artiest
          th
          th Nummers
        tr(v-for='artist in artists')
          td
            tijdloze-artist(:artist='artist')
          td
            tijdloze-country-icon(v-if="artist.countryId" :country='countries[artist.countryId]')
          td.s.wrap
            ul(v-if='artist.songs.length')
              li(v-for='song in artist.songs')
                tijdloze-song(:song='song')
</template>

<script>
  import _ from 'lodash'

  export default {
    computed: {
      artists() {
        return _.sortBy(
          this.$store.getters['entities/artists/query']().with('songs').all(),
          artist => [artist.name.toLowerCase(), artist.namePrefix ? artist.namePrefix.toLowerCase() : '']
        )
      },
      countries() {
        return this.$store.getters.countriesById;
      }
    },
    head: {
      title: 'Artiesten'
    }
  }
</script>
