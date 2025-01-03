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
      @initialResults="initialResults($event)"
      ref="searchBox"
    )
    v-btn.ml-2(@click='searchMusicbrainz' :disabled='processing' hide-details)
      v-progress-circular.mr-2(v-if="processing" size="small" indeterminate)
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
        waitingForResults: false,
        query: "",
        processing: false,
        showingResults: false,
        mbHit: undefined,
        requestError: false
      }
    },
    watch: {
      query: function() {
        this.showingResults = false
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
      initialResults(results) {
        if (this.waitingForResults) {
          this.waitingForResults = false
          if (results.length === 0) {
            this.searchMusicbrainz()
            this.$refs.searchBox.setSearchInactive()
          } else if (results.length === 1) {
            this.selectSearchResult(results[0])
            this.$refs.searchBox.setSearchInactive()
          }
        }
      },
      setQuery(newQuery) {
        this.query = newQuery;
        this.showingResults = false
        this.mbHit = undefined
        this.waitingForResults = true
      },
      async selectSearchResult(result) {
        this.$emit("selectSearchResult", result)
      },
      async searchMusicbrainz() {
        this.$emit('search');
        this.mbHit = undefined;
        this.showingResults = false;
        this.processing = true;

        const result = await this.$api(
            '/mbdata/search-query',
            useFetchOpts({params: {query: this.query}})
        ).catch(err => {
          this.requestError = true;
          this.processing = false;
        })

        if (result) {
          this.mbHit = result.hit;
          if (this.mbHit) {
            this.$emit('mbHit', this.mbHit);
          }
          this.processing = false;
          this.requestError = false;
          this.showingResults = true;
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
