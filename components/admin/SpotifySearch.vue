<template lang="pug">
div
  div.search
    v-text-field(v-model='query' @change='search' label='Titel en/of artiest' hide-details)
    v-btn(@click='search' :disabled='processing')
      | Zoeken op Spotify
  div(v-if="spotifyError")
    el-alert.alert(title="Fout bij het zoeken op Spotify" type="error" :closable="false" show-icon)
      div Probeer het nog eens, of voer de gegevens van het nummer manueel in.
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
            td.spotify
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
              v-btn(@click='select(track)' v-if="!selectedTrackId" type="primary") Selecteren
    ui-alert(title="Let op bij Spotify")
      ul
        li Het eerste zoekresultaat is niet altijd de originele album-versie.
        li De jaartallen van de albums kloppen niet altijd.
        li Het gebruik van hoofdletters volgt niet altijd de #[nuxt-link(to="/website/methodologie" target="_blank") conventies].
</template>

<script>
  import Spotify from '../Spotify'

  export default {
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
        spotifyTracks: [],
        spotifyError: false
      }
    },
    watch: {
      initialQuery(newQuery) {
        this.query = newQuery;
        if (newQuery) {
          this.search();
        } else {
          this.showingResults = false
          this.spotifyTracks = []
          this.selectedTrackId = undefined
        }
      }
    },
    methods: {
      async search() {
        this.spotifyTracks = [];
        this.selectedTrackId = undefined;
        this.showingResults = false;
        this.processing = true;

        const cleanQuery = this.query.replace(/[^\p{L}0-9 ]/u, "")

        const {data: result, error} = await useApiFetch('/spotify/find', {params: {query: cleanQuery, limit: 3}})

        if (result) {
          this.spotifyTracks = result;
          this.processing = false;
          this.spotifyError = false;
          this.showingResults = true;
        }
        if (error) {
          this.spotifyError = true;
          this.processing = false;
        }
      },
      select(track) {
        this.$emit('selectSpotifyTrack', track);
        this.selectedTrackId = track.spotifyId;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search{
    display: flex;

    .el-input {
      margin-right: 20px;
    }
  }

  table {
    margin: 10px auto 10px 0;

    td.spotify {
      max-width: 300px;
      padding-right: 10px;
    }

    td.details {
      font-size: 75%;
    }
  }
</style>
