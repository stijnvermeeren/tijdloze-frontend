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
        admin-wiki-url-input(v-model='fullSongData.urlWikiNl' lang='nl' :query='`${fullSongData.title} ${artist?.name ?? ""}`')
    v-row(dense)
      v-col
        admin-wiki-url-input(v-model='fullSongData.urlWikiEn' lang='en' :query='`${fullSongData.title} ${artist?.name ?? ""}`')
    v-row(dense)
      v-col
        song-spotify-input(
          v-model='fullSongData.spotifyId'
          :artist="artist?.name"
          :album="album?.title"
          :title="fullSongData.title"
        )
    v-row(dense)
      v-col
        admin-musicbrainz-input(
          v-model='fullSongData.musicbrainzRecordingId'
          musicbrainz-category="recording"
          :query='`${fullSongData.title} ${artist?.name ?? ""}`'
        )
    v-row(dense)
      v-col
        admin-musicbrainz-input(
          v-model='fullSongData.musicbrainzWorkId'
          musicbrainz-category="work"
          :query='fullSongData.title'
        )
    v-row(dense)
      v-col
        admin-wikidata-input(
          v-model='fullSongData.wikidataId'
          :query='`${fullSongData.title} ${artist?.name ?? ""}`'
        )
    v-row
      v-col
        admin-delete-btn(@click='submitDelete' :disabled='processing')
        v-btn(@click='submit' color="blue" :disabled='disabled') Aanpassen
</template>

<script setup lang="ts">
import type { SongFormData } from '~/api/contracts'
import { apiEndpoints } from '~/api/endpoints'
import Artist from "~/orm/Artist";
import Album from "~/orm/Album";
import {useRepo} from "pinia-orm";
import SongSpotifyInput from "~/components/admin/SongSpotifyInput.vue";
const {$api} = useNuxtApp()

definePageMeta({
  middleware: 'admin'
})

type SongEditDraftData = Omit<SongFormData, 'artistId' | 'albumId'> & {
  id: number
  artistId: number
  albumId?: number
}

const processing  = ref(false)

const songId = useRouteParam('id')
const fullSongData = ref<SongEditDraftData>({
  id: 0,
  title: '',
  artistId: 0
})
const {data: fetchedSongData, status} = await useApiFetch(apiEndpoints.song.byId(Number(songId)), { deep: true })
const title = ref('')  // not reactive

watch(status, (newValue) => {
  if (newValue === 'success' && fetchedSongData.value) {
    fullSongData.value = fetchedSongData.value
    title.value = fetchedSongData.value.title
  }
}, { immediate: true })

const artistId = computed(() => {
  return fullSongData.value.artistId;
})
const album = computed(() => {
  const albumId = fullSongData.value.albumId
  if (albumId === undefined) {
    return undefined
  }
  return useRepo(Album).find(albumId);
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
  if (!fullSongData.value.id || !fullSongData.value.artistId || !fullSongData.value.albumId) {
    return
  }

  const { id, artistId, albumId, ...rest } = fullSongData.value
  const payload: SongFormData = {
    ...rest,
    artistId,
    albumId
  }

  processing.value = true;
  await $api(apiEndpoints.song.update(id), payload)
  await navigateTo(`/nummer/${fullSongData.value.id}`)
}
async function submitDelete() {
  if (!fullSongData.value.id || !fullSongData.value.artistId) {
    return
  }
  if (confirm("Dit nummer echt volledig verwijderen uit de database?")) {
    processing.value = true;
    await $api(apiEndpoints.song.delete(fullSongData.value.id))
    await useRouter().push(`/artiest/${fullSongData.value.artistId}`);
  }
}
</script>
