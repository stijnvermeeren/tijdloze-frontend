<template lang="pug">
div
  div.d-flex
    v-text-field.mr-4(v-model='query' @change='search' label='Titel en/of artiest' hide-details)
    v-btn(@click='search' :disabled='processing')
      | Zoeken op Spotify
  div(v-if="spotifyError")
    ui-alert(type="error" title="Fout bij het zoeken op Spotify")
      div Probeer het nog eens, of voer de gegevens van het nummer manueel in.
  template(v-if="showingResults")
    div(v-if='!spotifyTracks.length')
      | Geen resultaten van Spotify. Controlleer de query.
    div(v-else)
      table
        tbody
          template(
            v-for='track in spotifyTracks'
            :key='track.spotifyId'
          )
            tr(v-if="!selectedTrackId || selectedTrackId === track.spotifyId")
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
  export default defineNuxtComponent({
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

        if (result.value) {
          this.spotifyTracks = result.value;
          this.processing = false;
          this.spotifyError = false;
          this.showingResults = true;
        }
        if (error.value) {
          this.spotifyError = true;
          this.processing = false;
        }
      },
      select(track) {
        this.$emit('selectSpotifyTrack', track);
        this.selectedTrackId = track.spotifyId;
      }
    }
  })
</script>

<style lang="scss" scoped>
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
