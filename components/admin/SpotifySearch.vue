<template lang="pug">
  div
    div
      input(v-model='query' @keypress.enter='search()' placeholder='Titel en/of artiest')
      button(@click='search()' :disabled='processing')
        | Zoeken op Spotify
      |  (
      a(:href="`https://www.google.com/search?q=${encodeURIComponent(query)}`" target="_blank")
        | Zoek meer info op Google
      | )
    template(v-if="showingResults")
      div(v-if='!spotifyTracks.length')
        | Geen resultaten van Spotify. Controlleer de query.
      div(v-else)
        table
          tbody
            tr(
              v-for='track in spotifyTracks'
              v-if="!selectedTrackId || selectedTrackId === track.spotifyId"
              :key='track.spotifyId'
            )
              td
                spotify(:spotify-id='track.spotifyId')
              td.details
                div
                  | Artist:
                  |
                  strong {{track.artist}}
                div
                  | Titel:
                  |
                  strong {{track.title}}
                div
                  | Album:
                  |
                  em {{track.album}}
                  |
                  |({{track.year}}).
              td
                button(@click='select(track)' v-if="!selectedTrackId") Selecteren
</template>

<script>
  import Spotify from '../Spotify'

  export default {
    name: 'SpotifySearch',
    components: {Spotify},
    props: {
      initialQuery: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        query: this.initialQuery,
        processing: false,
        showingResults: false,
        selectedTrackId: undefined,
        spotifyTracks: []
      }
    },
    watch: {
      initialQuery(newQuery) {
        if (newQuery) {
          this.query = newQuery;
          this.search();
        }
      }
    },
    methods: {
      search() {
        this.spotifyTracks = [];
        this.selectedTrackId = undefined;
        this.showingResults = false;
        this.processing = true;

        const cleanQuery = this.query.replace(/[^\p{L}0-9 ]/u, "")

        this.$axios.$get('/spotify/find', {params: {query: cleanQuery, limit: 3}}).then(result => {
          this.spotifyTracks = result;
          this.processing = false;
          this.showingResults = true;
        })
      },
      select(track) {
        this.$emit('selectSpotifyTrack', track);
        this.selectedTrackId = track.spotifyId;
      }
    }
  }
</script>

<style lang="scss" scoped>
  input {
    width: 300px;
  }

  table {
    width: auto;
    margin: 10px auto 10px 0;

    td.details {
      font-size: 75%;
    }
  }
</style>
