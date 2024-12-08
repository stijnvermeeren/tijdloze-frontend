<template lang="pug">
div
  div.d-flex.align-center
    search-box.flex-grow-1(
      v-model="query"
      placeholder='Artiest en titel'
      :artist-filter='artist => false'
      :album-filter='album => false'
      :song-filter='possibleSong'
      :songs-year='previousYear'
      @selectSearchResult='selectSearchResult($event)'
      @initialResultCount="initialResultCount($event)"
      no-auto-clear
    )
    v-btn(@click='searchMusicbrainz' :disabled='processing' hide-details)
      | Zoeken op MusicBrainz
  div(v-if="requestError")
    ui-alert(type="error" title="Fout bij het zoeken in de MusicBrainz dataset.")
      div Probeer het nog eens, of voer de gegevens van het nummer manueel in.
  template(v-if="showingResults")
    div(v-if='!mbHit')
      | Geen resultaten in de MusicBrainz dataset. Controlleer de query.
</template>

<script>
  import {useRootStore} from "~/stores/root";

  export default defineNuxtComponent({
    data() {
      return {
        query: "",
        processing: false,
        showingResults: false,
        mbHit: undefined,
        requestError: false
      }
    },
    computed: {
      currentYear() {
        return useRootStore().currentYear;
      },
      previousYear() {
        return this.currentYear.previous;
      }
    },
    methods: {
      initialResultCount(count) {
        if (this.query && count === 0) {
          this.searchMusicbrainz()
        }
      },
      setQuery(newQuery) {
        this.query = newQuery;
        this.showingResults = false
        this.mbHit = undefined
      },
      async selectSearchResult(result) {
        this.$emit("selectSearchResult", result)
      },
      async searchMusicbrainz() {
        this.mbHit = undefined;
        this.showingResults = false;
        this.processing = true;

        const {data: result, error} = await useApiFetch('/mbdata/search-query', {params: {query: this.query}})

        if (result.value) {
          this.mbHit = result.value.hit;
          if (this.mbHit) {
            this.$emit('mbHit', this.mbHit);
          }
          this.processing = false;
          this.requestError = false;
          this.showingResults = true;
        }
        if (error.value) {
          this.requestError = true;
          this.processing = false;
        }
      },
      possibleSong(song) {
        return !song.position(this.currentYear, true);
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
