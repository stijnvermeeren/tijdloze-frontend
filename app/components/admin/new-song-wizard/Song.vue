<template lang="pug">
v-container
  v-row(dense)
    v-col
      v-text-field(v-model='songDetails.title' label="Titel" hide-details)
  v-row(dense)
    v-col
      admin-language-input(v-model='songDetails.languageId')
  v-row(dense)
    v-col
      admin-lead-vocals-input(v-model='songDetails.leadVocals')
  v-row(dense)
    v-col
      admin-musicbrainz-input(
        v-model='songDetails.recordingMBId'
        musicbrainz-category="recording"
      )
  v-row(dense)
    v-col
      admin-musicbrainz-input(
        v-model='songDetails.workMBId'
        musicbrainz-category="work"
      )
  v-row(dense)
    v-col
      admin-song-spotify-input(
        v-model="songDetails.spotifyId"
        :artist="artistName"
        :album="albumTitle"
        :title="songDetails.title"
        ref="spotify"
      )
  v-row(dense)
    v-col(v-if="existingSong")
      ui-alert(type="warning" title="Opgelet! Dit nummer is reeds in de database!")
        v-btn(@click="selectExisting()")
          | Selecteer&nbsp;
          strong {{existingSong.title}}
          | &nbsp;uit de database
</template>

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
import type SongSpotifyInput from '~/components/admin/SongSpotifyInput.vue'
import languages from '~/utils/language'
import Artist from "~/orm/Artist";
import type Song from "~/orm/Song";
import {useRepo} from "pinia-orm";

const {$api} = useNuxtApp()
const emit = defineEmits(['existingSong'])

interface SongDetails {
  title: string
  languageId?: string
  leadVocals?: string
  recordingMBId?: string
  workMBId?: string
  spotifyId?: string
}

const spotifyRef = useTemplateRef<InstanceType<typeof SongSpotifyInput>>('spotify')
const languageMap = languages

const props = defineProps<{
  artistId?: number
  artistName?: string
  albumTitle?: string
}>()

function defaultSongDetails(): SongDetails {
  return {
    title: '',
    languageId: undefined,
    leadVocals: undefined,
    recordingMBId: undefined,
    workMBId: undefined,
    spotifyId: undefined
  }
}

const songDetails = ref<SongDetails>(defaultSongDetails())
const existingSong = ref<Song | undefined>(undefined)

const songValid = computed(() => {
  return !! songDetails.value.title;
})

watch(() => songDetails.value.spotifyId, async () => {
  existingSong.value = await loadExistingSong()
})

function selectExisting() {
  emit('existingSong', existingSong.value);
}

async function loadExistingSong() {
  if (props.artistId && songDetails.value.spotifyId) {
    const artist = useRepo(Artist)
        .withAll()
        .with('songs', q => q
            .with('artist')
            .with('secondArtist'))
        .find(props.artistId)
    if (artist) {
      for (const song of artist.songs) {
        const fullSongData = await $api(apiEndpoints.song.byId(song.id))
        if (fullSongData) {
          if (fullSongData.spotifyId === songDetails.value.spotifyId) {
            return song
          }
        }
      }
    }
  }
}

async function loadPreset(title: string, recordingMBId?: string, workMBId?: string, languageId?: string, leadVocalsId?: string) {
  songDetails.value.title = title;
  songDetails.value.recordingMBId = recordingMBId;
  songDetails.value.workMBId = workMBId;
  songDetails.value.leadVocals = leadVocalsId;

  if (languageId === 'zxx') {
    songDetails.value.languageId = 'i';
  } else if (languageId && languageMap[languageId]) {
    songDetails.value.languageId = languageId;
  } else {
    songDetails.value.languageId = undefined;
  }

  await nextTick(() => spotifyRef.value?.search())
}

async function submit(artistId: number, secondArtistId: number | undefined, albumId: number) {
  const songData = {
    artistId: artistId,
    secondArtistId: secondArtistId,
    albumId: albumId,
    title: songDetails.value.title,
    languageId: songDetails.value.languageId,
    leadVocals: songDetails.value.leadVocals,
    spotifyId: songDetails.value.spotifyId,
    musicbrainzRecordingId: songDetails.value.recordingMBId,
    musicbrainzWorkId: songDetails.value.workMBId
  }
  return await $api(apiEndpoints.song.create(), songData);
}

function reset() {
  songDetails.value = defaultSongDetails()
  existingSong.value = undefined
}

defineExpose({
  loadPreset, submit, reset, songValid
})
</script>

<style scoped>
</style>
