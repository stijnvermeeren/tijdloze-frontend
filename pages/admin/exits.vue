<template lang="pug">
Title Admin: Exits markeren
div(style="min-height: 30em")
  h2 Exits markeren ({{currentYear.yyyy}})
  div
    search-box(
      :placeholder='`Zoek nummer uit de Tijdloze van ${previousYear.yyyy}`'
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

<script setup>
import Song from '~/orm/Song'
import {useRootStore} from "~/stores/root";
import {useRepo} from "pinia-orm";

const {$api} = useNuxtApp()

definePageMeta({ middleware: 'admin' })

const exitSongIds = computed(() => {
  return useRootStore().exitSongIds;
})
const exits = computed(() => {
  return exitSongIds.value.map(id => {
    return useRepo(Song).with('artist').with('secondArtist').find(id)
  });
})
const currentYear = computed(() => {
  return useRootStore().currentYear;
})
const previousYear = computed(() => {
  return currentYear.value.previous;
})

function songValid(song) {
  const inPreviousYear = song.position(previousYear.value);

  const notYetInCurrentYear = currentYear.value ? !song.position(currentYear.value) : true;
  const notYetMarked = !exitSongIds.value.includes(song.id);
  return inPreviousYear && notYetInCurrentYear && notYetMarked;
}
async function unmarkAll() {
  await $api(`/list-exit/${currentYear.value.yyyy}`, useFetchOptsDelete());
}
async function unmarkExit(song) {
  await $api(`/list-exit/${currentYear.value.yyyy}/${song.id}`, useFetchOptsDelete());
}
async function markExit(song) {
  await $api(`/list-exit/${currentYear.value.yyyy}/${song.id}`, useFetchOptsPost());
}
</script>
