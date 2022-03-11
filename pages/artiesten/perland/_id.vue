<template lang="pug">
  div
    h2 Artiesten: {{countryName}}
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
  import countries from '~/utils/country'

  export default {
    components: {SongWithSecondArtistLink},
    computed: {
      countryName() {
        return countries[this.$route.params.id] || "Onbekend land";
      },
      artists() {
        return Artist.query()
          .with('songs.secondArtist')
          .with('secondarySongs.artist')
          .where(artist => artist.countryId === this.$route.params.id)
          .all();
      }
    },
    head() {
      return {
        title: `Artiesten: ${this.countryName}`
      }
    }
  }
</script>
