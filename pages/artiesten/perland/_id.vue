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
            ul(v-if='artist.allSongs.length')
              li(v-for='song in artist.allSongs')
                song-with-second-artist-link(:song='song' :artist="artist")
</template>

<script>
  import SongWithSecondArtistLink from '../../../components/SongWithSecondArtistLink'
  import Artist from "@/orm/Artist";

  export default {
    components: {SongWithSecondArtistLink},
    computed: {
      country() {
        return this.$store.getters.countriesById[this.$route.params.id];
      },
      artists() {
        return Artist.query()
          .with('songs.secondArtist')
          .with('secondarySongs.artist')
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
