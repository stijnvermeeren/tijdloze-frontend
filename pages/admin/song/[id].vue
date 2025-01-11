<template lang="pug">
Title Admin: Song: {{title}}
div
  h2 Nummer aanpassen
  v-container
    v-row(dense)
      v-col
        v-text-field(v-model='fullSongData.title' label="Titel" hide-details)
    v-row(dense)
      v-col
        v-text-field(
          v-model='fullSongData.aliases'
          label='Aliases (het nummer wordt ook onder deze titels gevonden)'
          hide-details
          density="compact"
        )
    v-row(dense)
      v-col
        admin-artist-select(v-model='fullSongData.artistId')
    v-row(dense)
      v-col
        admin-artist-select(v-model='fullSongData.secondArtistId' :required='false' label="Tweede artiest" density="compact")
    v-row(dense)
      v-col
        admin-album-select(v-model='fullSongData.albumId' :artist-id='fullSongData.artistId')
    v-row(dense)
      v-col
        admin-language-input(v-model='fullSongData.languageId')
    v-row(dense)
      v-col
        admin-lead-vocals-input(v-model='fullSongData.leadVocals')
    v-row(dense)
      v-col
        v-textarea(v-model='fullSongData.notes' label="Opmerkingen" rows="2" auto-grow hide-details)
    v-row(dense)
      v-col
        v-textarea(v-model='fullSongData.lyrics' label="Lyrics" rows="5" hide-details)
    v-row(dense)
      v-col
        admin-wiki-url-input(v-model='fullSongData.urlWikiNl' lang='nl' :query='`${fullSongData.title} ${artist.name}`')
    v-row(dense)
      v-col
        admin-wiki-url-input(v-model='fullSongData.urlWikiEn' lang='en' :query='`${fullSongData.title} ${artist.name}`')
    v-row(dense)
      v-col
        song-spotify-input(
          v-model='fullSongData.spotifyId'
          :artist="artist?.name"
          :album="album?.title"
          :title="fullSongData.title"
        )
    v-row
      v-col
        admin-delete-btn(@click='submitDelete' :disabled='processing')
        v-btn(@click='submit' color="blue" :disabled='disabled') Aanpassen
</template>

<script setup>
import Artist from "@/orm/Artist";
import Album from "@/orm/Album";
import {useRepo} from "pinia-orm";
import SongSpotifyInput from "~/components/admin/SongSpotifyInput.vue";

const {$api} = useNuxtApp()

definePageMeta({
  middleware: 'admin'
})

const processing  = ref(false)

const {data: fullSongData, status} = await useFetch(`song/${useRoute().params.id}`, useFetchOpts())
const title = ref(fullSongData.value.title)  // not reactive

watch(status, (newValue) => {
  if (newValue === 'success') {
    title.value = fullSongData.value.title
  }
})

const artistId = computed(() => {
  return fullSongData.value.artistId;
})
const album = computed(() => {
  return useRepo(Album).find(fullSongData.value.albumId);
})
const artist = computed(() => {
  return useRepo(Artist).find(fullSongData.value.artistId);
})
const disabled = computed(() => {
  return processing.value || !fullSongData.value.title || !fullSongData.value.artistId ||
    !fullSongData.value.albumId
})

watch(artistId, () => {
  fullSongData.value.albumId = undefined
})

async function submit() {
  processing.value = true;
  await $api(`song/${fullSongData.value.id}`, useFetchOptsPut(fullSongData.value))
  await navigateTo(`/nummer/${fullSongData.value.id}`)
}
async function submitDelete() {
  if (confirm("Dit nummer echt volledig verwijderen uit de database?")) {
    processing.value = true;
    await $api(`song/${fullSongData.value.id}`, useFetchOptsDelete())
    await useRouter().push(`/artiest/${fullSongData.value.artistId}`);
  }
}
</script>
