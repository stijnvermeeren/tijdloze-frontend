<template lang="pug">
  div
    div
      input(v-model='query' @keypress.enter='search()' placeholder='Titel en/of artiest')
      button(@click='search()' :disabled='processing')
        | Zoeken op Spotify
      |  (
      a(:href="`https://www.google.com/search?q=${query}`" target="_blank")
        | Zoeken op Google
      | )
    div(v-if='noResults')
      | Geen resultaten van Spotify. Controlleer de query.
    div(v-if='spotifyTracks.length')
      table
        tbody
          tr(v-for='track in spotifyTracks' :key='track.spotifyId')
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
              button(@click='select(track)') Selecteren
      div
        button(@click='cancel()') Zoeken annuleren
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
        spotifyTracks: [],
        noResults: false
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
      cancel() {
        this.query = '';
        this.spotifyTracks = [];
      },
      search() {
        this.spotifyTracks = [];
        this.processing = true;
        this.$axios.$get('/spotify/find', {params: {query: this.query, limit: 3}}).then(result => {
          this.spotifyTracks = result;
          if (!this.spotifyTracks.length) {
            this.noResults = true;
          }
          this.processing = false;
        })
      },
      select(track) {
        this.$emit('selectSpotifyTrack', track);
        this.cancel();
      }
    }
  }
</script>

<style lang="less" scoped>
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
