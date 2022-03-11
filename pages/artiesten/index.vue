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
            tijdloze-country-icon(v-if="artist.countryId" :country-id='artist.countryId')
          td.s.wrap
            ul(v-if='artist.allSongs.length')
              li(v-for='song in artist.allSongs')
                song-with-second-artist-link(:song='song' :artist="artist")
</template>

<script>
  import _ from 'lodash'
  import SongWithSecondArtistLink from '../../components/SongWithSecondArtistLink'
  import Artist from "@/orm/Artist";

  export default {
    components: {SongWithSecondArtistLink},
    computed: {
      artists() {
        return _.sortBy(
          Artist.query()
            .with('songs.secondArtist')
            .with('secondarySongs.artist')
            .all(),
          artist => [artist.name.toLowerCase(), artist.namePrefix ? artist.namePrefix.toLowerCase() : '']
        )
      }
    },
    head: {
      title: 'Artiesten'
    }
  }
</script>
