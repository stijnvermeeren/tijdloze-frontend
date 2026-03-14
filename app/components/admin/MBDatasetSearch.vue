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

<script setup lang="ts">
import type { MBDatasetHit, MBDatasetSearchResponse } from '~/api/contracts'
import { apiEndpoints } from '~/api/endpoints'
import type SearchBox from '~/components/SearchBox.vue'
import type Song from '~/orm/Song'

const {$api} = useNuxtApp()

const emit = defineEmits(["search", "selectSearchResult", "mbHit"])

const waitingForResults = ref(false)
const query = ref("")
const processing = ref(false)
const showingResults = ref(false)
const mbHit = ref<MBDatasetHit | undefined>(undefined)
const requestError = ref(false)

const searchBoxRef = useTemplateRef<InstanceType<typeof SearchBox>>('searchBox')

watch(query, () => {
  showingResults.value = false
})

const {currentYear, previousYear} = storeToRefs(useYearStore())

function initialResults(results: unknown[]) {
  if (waitingForResults.value) {
    waitingForResults.value = false
    if (results.length === 0) {
      searchMusicbrainz()
      if (searchBoxRef.value) {
        searchBoxRef.value.searchActive = false
      }
    } else if (results.length === 1) {
      selectSearchResult(results[0])
      if (searchBoxRef.value) {
        searchBoxRef.value.searchActive = false
      }
    }
  }
}
function setQuery(newQuery: string) {
  query.value = newQuery;
  showingResults.value = false
  mbHit.value = undefined
  waitingForResults.value = true
}
function selectSearchResult(result: unknown) {
  emit("selectSearchResult", result)
}
async function searchMusicbrainz() {
  emit('search');
  mbHit.value = undefined;
  showingResults.value = false;
  processing.value = true;

  const result = await $api(apiEndpoints.mbdata.searchQuery(), { params: {query: query.value} }).catch(err => {
    requestError.value = true;
    processing.value = false;
  })

  if (result) {
    mbHit.value = result.hit;
    if (mbHit.value) {
      emit('mbHit', mbHit.value);
    }
    processing.value = false;
    requestError.value = false;
    showingResults.value = true;
  }
}

function possibleSong(song: Song) {
  return !currentYear.value || !song.position(currentYear.value, true);
}

defineExpose({
  setQuery
})
</script>

<style scoped>
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
