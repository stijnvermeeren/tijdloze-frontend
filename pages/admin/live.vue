<template lang="pug">
Title Admin: nummers toevoegen
div
  div.flexTitle
    h2 Admin: nummers toevoegen
    div
      nuxt-link(to="/admin/lijst")
        v-btn(color="amber" rounded size="small") Nummers verwijderen uit de lijst

  ui-alert(v-if='previousSong'
    type="success"
    :title="`Net toegevoegd op positie ${previousPosition} in ${currentYear.yyyy}`"
  )
    div
      | {{ previousSong.artist.name }}
      template(v-if='previousSong.secondArtist')
        |
        | en {{previousSong.secondArtist.name}}
      |
      | - {{ previousSong.title }}
      |
      v-btn(@click='undo()' :disabled='processing' rounded size="small") Ongedaan maken

  v-btn(v-if='!lastSong' @click='deleteYear' rounded color="warning")
    | Jaar {{currentYear.yyyy}} starten ongedaan maken

  v-btn(v-if='lastPosition === 1 && nextYearYyyy !== currentYear.yyyy' @click='startYear' rounded color="blue")
    | Jaar {{nextYearYyyy}} starten

  ui-card.overflow-visible(title="Volgend nummer")
    template(#buttons)
      div
        v-text-field.d-inline-block(
          v-model.number="nextPosition"
          :label="`Positie in ${currentYear.yyyy}`"
          type="number"
          hide-details
        )

    div.query(v-if="importQuery")
      | Importeren van "{{importQuery}}".
      =" "
      v-btn(
        size="small"
        rounded
        :prepend-icon="mdiSearchWeb"
        :href="`https://www.google.com/search?q=${encodeURIComponent(importQuery)}`"
        target="_blank"
      ) Zoek info op Google

    div(v-show="nextPosition > 0")
      admin-m-b-dataset-search(
        v-model="query"
        @mbHit='fillMBData($event)'
        @search="nextSongTab = 'hide'"
        @selectSearchResult="selectExistingSong($event.item)"
        ref="search"
      )

      hr.my-2

      div(v-if="nextSongTab === 'existing' && nextSong")
        div
          | Gevonden in de database:
          |
          strong {{nextSong.artist.name}} - {{nextSong.title}}
          |  (in {{previousYear.yyyy}} op positie {{nextSong.position(previousYear, true)}})
        div(v-if='nextSongFullData && nextSongFullData.spotifyId')
          spotify(:spotify-id='nextSongFullData.spotifyId')
        div
          v-btn(@click='add(nextSong.id)' :disabled='!nextValid' rounded)
            | Toevoegen op positie {{nextPosition}} in {{currentYear.yyyy}}

      div(v-show="nextSongTab === 'new'")
        admin-new-song-wizard(
          :button-label='`Toevoegen op positie ${nextPosition} in ${currentYear.yyyy}`'
          @newSong='add($event.id)'
          @existingSong='selectExistingSong($event)'
          ref="wizard"
        )

      div(v-if="nextSongTab === 'hide'")
        v-btn(@click="nextSongTab = 'new'" variant="plain" ripple) Nieuw nummer manueel toevoegen


  ui-card(:title="`Tijdloze ${currentYear.yyyy}: import`")
    template(#buttons)
      v-btn(v-if="importSongs.length" @click="cancelImport" color="amber" rounded size="small") Import annuleren
    div(v-if="importSongs.length")
      div In de wachtrij om geïmporteerd te worden...
      div(v-for="{overridePosition, query} in importSongs")
        strong {{overridePosition}}.
        =" "
        span {{query}}
    div(v-else)
      admin-import-form(:startPosition="nextPosition" @startImport="startImport")
</template>

<script setup>
import Song from "@/orm/Song";
import {mdiSearchWeb} from "@mdi/js";
import {useRepo} from "pinia-orm";

const {$api} = useNuxtApp()

definePageMeta({ middleware: 'admin' })

const wizard = useTemplateRef('wizard')
const search = useTemplateRef('search')

const {lastSong, lastPosition} = storeToRefs(useRootStore())
const {currentYear, previousYear} = storeToRefs(useYearStore())

const nextSongTab = ref('hide')
const nextSong = ref(undefined)
const nextSongFullData = ref(undefined)
const processing = ref(false)
const query = ref('')
const importQuery = ref('')
const importSongs = ref([])
const nextPosition = ref(lastPosition.value ? lastPosition.value - 1 : 100)
const previousPosition = ref(undefined)

const nextYearYyyy = computed(() => {
  return (new Date()).getFullYear();
})
const nextPositionAuto = computed(() => {
  return lastPosition.value ? lastPosition.value - 1 : 100;
})
const previousSong = computed(() => {
  if (previousPosition.value) {
    return useRepo(Song).withAll().get().find(song => song.position(currentYear.value, true) === previousPosition.value)
  } else {
    return undefined
  }
})
const nextValid = computed(() => {
  if (nextSongTab.value === 'existing') {
    return !!nextSong.value
  } else {
    return true
  }
})

watch(nextPositionAuto, (newValue) => {
  if (!importQuery.value) {
    nextPosition.value = newValue
  }
})

function loadNextFromImport() {
  let canBeImported = false;
  let nextImport = importSongs.value.shift();
  while (!canBeImported && nextImport) {
    const {overridePosition, query: newQuery} = nextImport;
    if (!overridePosition || !useRootStore().songs.find(song => song.position(currentYear.value, true) === overridePosition)) {
      importQuery.value = newQuery
      query.value = newQuery
      search.value.setQuery(newQuery)
      nextPosition.value = overridePosition;
      canBeImported = true;
    } else {
      nextImport = importSongs.value.shift()
    }
  }
  if (!canBeImported) {
    importQuery.value = ''
    query.value = ''
    search.value.setQuery('')
    nextPosition.value = nextPositionAuto.value
  }
}
function startImport(songs) {
  const allSongs = useRepo(Song).withAll().get()
  for (const song of songs) {
    const queryFragments = useSearchQueryFragments(song.query)
    const results = allSongs.filter(useSearchFilter(queryFragments, useSearchSongContent))
    if (results.length !== 1) {
      console.log(song.query, results.length)
    }
  }

  importSongs.value = songs
  loadNextFromImport();
}
function cancelImport() {
  importSongs.value = []
}
async function selectExistingSong(song) {
  nextSongTab.value = 'existing';
  nextSong.value = song;
  nextSongFullData.value = undefined;
  nextSongFullData.value = await $api(`song/${nextSong.value.id}`);
}
function fillMBData(data) {
  nextSongTab.value = 'new';
  wizard.value.loadPreset({
    songTitle: data.title,
    artistName: data.name,
    artistMBId: data.artistMBId,
    artistCountryId: data.countryId,
    secondArtistName: data.secondArtistName,
    secondArtistMBId: data.secondArtistMBId,
    secondArtistCountryId: data.secondArtistCountryId,
    albumTitle: data.albumTitle,
    albumMBId: data.albumMBId,
    albumYear: data.releaseYear,
    albumIsSingle: data.isSingle,
    albumIsSoundtrack: data.isSoundtrack
  });
}
async function undo() {
  processing.value = true;
  await $api(`list-entry/${currentYear.value.yyyy}/${previousPosition.value}`, useFetchOptsDelete())
  previousPosition.value = undefined;
  processing.value = false;
}
async function startYear() {
  processing.value = true;
  await $api(`year/${nextYearYyyy.value}`, useFetchOptsPost())
  processing.value = false;
}
async function deleteYear() {
  processing.value = true;
  await $api(`year/${currentYear.value.yyyy}`, useFetchOptsDelete())
  processing.value = false;
}
async function add(songId) {
  processing.value = true;
  const position = nextPosition.value
  const data = {
    songId
  }
  await $api(`list-entry/${currentYear.value.yyyy}/${position}`, useFetchOptsPost(data))
  previousPosition.value = position;
  nextSongTab.value = 'hide';
  nextSong.value = undefined;
  nextSongFullData.value = undefined;
  processing.value = false;

  loadNextFromImport();
}
</script>
