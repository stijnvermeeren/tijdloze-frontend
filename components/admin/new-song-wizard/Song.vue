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

<script setup>
import languages from '~/utils/language'
import Artist from "~/orm/Artist";
import {useRepo} from "pinia-orm";

const {$api} = useNuxtApp()
const emit = defineEmits(['existingSong'])

const spotifyRef = useTemplateRef('spotify')

const props = defineProps({
  artistId: Number,
  artistName: String,
  albumTitle: String
})

function defaultSongDetails() {
  return {
    title: '',
    languageId: undefined,
    leadVocals: undefined,
    recordingMBId: undefined,
    workMBId: undefined,
    spotifyId: undefined
  }
}

const songDetails = ref(defaultSongDetails())
const existingSong = ref(undefined)

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
        const fullSongData = await $api(`song/${song.id}`)
        if (fullSongData) {
          if (fullSongData.spotifyId === songDetails.value.spotifyId) {
            return song
          }
        }
      }
    }
  }
}

async function loadPreset(title, recordingMBId, workMBId, languageId) {
  songDetails.value.title = title;
  songDetails.value.recordingMBId = recordingMBId;
  songDetails.value.workMBId = workMBId;

  if (languageId === 'zxx') {
    songDetails.value.languageId = 'i';
  } else if (languages[languageId]) {
    songDetails.value.languageId = languageId;
  } else {
    songDetails.value.languageId = undefined;
  }

  await nextTick(spotifyRef.value.search)
}

async function submit(artistId, secondArtistId, albumId) {
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
  return await $api('/song', useFetchOptsPost(songData));
}

function reset() {
  songDetails.value = defaultSongDetails()
  existingSong.value = undefined
}

defineExpose({
  loadPreset, submit, reset, songValid
})
</script>

<style lang="scss" scoped>
</style>
