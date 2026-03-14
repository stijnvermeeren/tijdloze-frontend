<template lang="pug">
Title Admin: Exits markeren
div(style="min-height: 30em")
  h2 Exits markeren ({{currentYear?.yyyy}})
  div
    search-box(
      :placeholder='`Zoek nummer uit de Tijdloze van ${previousYear?.yyyy}`'
      :song-filter='songValid', :songs-year='previousYear'
      :album-filter='album => false'
      :artist-filter='artist => false'
      @selectSearchResult='markExit($event.item)'
    )

  div(v-if='exits.length')
    h3 Exits
    div
      ul
        li(v-for='song in exits', :key='song.id')
          | {{song.artist.name}}
          template(v-if='song.secondArtist')
            |
            | en {{song.secondArtist.name}}
          |
          | - {{song.title}}
          v-btn(@click='unmarkExit(song)') Terugzetten
  div
    v-btn(@click='unmarkAll()') Alle exits terugzetten
</template>

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
import Song from '~/orm/Song'
import {useRepo} from "pinia-orm";

const {$api} = useNuxtApp()

definePageMeta({ middleware: 'admin' })

const {currentYear, previousYear} = storeToRefs(useYearStore())
const {exitSongIds} = storeToRefs(useRootStore())

const exits = computed<Song[]>(() => {
  return exitSongIds.value
    .flatMap((id) => {
      const song = useRepo(Song).with('artist').with('secondArtist').find(id)
      return song ? [song] : []
    })
})


function songValid(song: Song): boolean {
  const inPreviousYear = previousYear.value ? song.position(previousYear.value) : false
  const notYetInCurrentYear = currentYear.value ? !song.position(currentYear.value) : true;
  const notYetMarked = !exitSongIds.value.includes(song.id);
  return !!inPreviousYear && notYetInCurrentYear && notYetMarked;
}
async function unmarkAll() {
  await $api(apiEndpoints.listExit.clear(currentYear.value!.yyyy));
}
async function unmarkExit(song: Song) {
  await $api(apiEndpoints.listExit.remove(currentYear.value!.yyyy, song.id));
}
async function markExit(song: Song) {
  await $api(apiEndpoints.listExit.add(currentYear.value!.yyyy, song.id), undefined);
}
</script>
