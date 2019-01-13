<template lang="pug">
  div
    h2 Artiesten: {{this.country.name}}
    table.lijst.perVijf
      tbody
        tr
          th Artiest
          th Nummers
        tr(v-for='artist in artists')
          td
            tijdloze-artist(:artist='artist')
          td.s.wrap
            ul(v-if='artist.songs.length')
              li(v-for='song in artist.songs')
                tijdloze-song(:song='song')
</template>

<script>
  export default {
    computed: {
      country() {
        return this.$store.getters.countriesById[this.$route.params.id];
      },
      artists() {
        return this.$store.getters['entities/artists']()
          .with('songs')
          .where(artist => artist.countryId === this.country.id)
          .all();
      }
    },
    head() {
      return {
        title: `Artiesten: ${this.country.name}`
      }
    }
  }
</script>
