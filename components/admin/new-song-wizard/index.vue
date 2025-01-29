<template lang="pug">
div
  div
    div.heading Artiest
    admin-new-song-wizard-artist.indent(ref="artist2")
  div
    v-checkbox(v-model="hasSecondArtist" label="Tweede artiest")
  div(v-show="hasSecondArtist")
    div.heading Tweede artiest
    admin-new-song-wizard-artist.indent(ref="secondArtist")

  div.heading Album
  admin-new-song-wizard-album.indent(:artist-id="artistId" ref="album")

  div.heading Nummer
  admin-new-song-wizard-song(
    :artist-id="artistId"
    :artist-name="artistRef?.artistName"
    :album-title="albumRef?.albumTitle"
    ref="song"
    @existingSong="emit('existingSong', $event)"
  )

  div
    v-btn(
      color="blue"
      rounded
      :disabled='!isValid || submitting'
      @click='submit'
    ) {{buttonLabel}}
</template>

<script setup>
const emit = defineEmits(['existingSong', 'newSong'])
const {$api} = useNuxtApp()

const spotifyRef = useTemplateRef('spotify')
const artistRef = useTemplateRef('artist2')
const secondArtistRef = useTemplateRef('secondArtist')
const albumRef = useTemplateRef('album')
const songRef = useTemplateRef('song')

const hasSecondArtist = ref(false)
const submitting = ref(false)

const props = defineProps({
  buttonLabel: {
    type: String,
    default: "Toevoegen"
  }
})

const artistId = computed(() => {
  if (artistRef.value?.artistId && artistRef.value.artistType === 'existing') {
    return artistRef.value.artistId;
  }
})
const isValid = computed(() => {
  const secondArtistValid = !hasSecondArtist.value || secondArtistRef.value?.artistValid
  return artistRef.value?.artistValid && secondArtistValid && albumRef.value?.albumValid && songRef.value?.songValid
})

async function loadPreset(preset) {
  artistRef.value.loadPreset(preset.artistName, preset.artistMBId, preset.artistCountryId)

  if (preset.secondArtistName) {
    hasSecondArtist.value = true
    secondArtistRef.value.loadPreset(preset.secondArtistName, preset.secondArtistMBId, preset.secondArtistCountryId)
  } else {
    hasSecondArtist.value = false
    secondArtistRef.value.reset()
  }

  albumRef.value.loadPreset(preset.albumTitle, preset.albumMBId, preset.albumYear, preset.albumIsSoundtrack, preset.albumIsSoundtrack)
  songRef.value.loadPreset(preset.songTitle)
}

async function submit() {
  submitting.value = true;

  let payloadArtistId = await artistRef.value.submit()

  let payloadSecondArtistId = undefined;
  if (hasSecondArtist.value) {
    payloadSecondArtistId = await secondArtistRef.value.submit()
  }

  const payloadAlbumId = await albumRef.value.submit(payloadArtistId)

  const song = await songRef.value.submit(payloadArtistId, payloadSecondArtistId, payloadAlbumId)

  artistRef.value.reset()
  hasSecondArtist.value = false
  secondArtistRef.value.reset()
  albumRef.value.reset()
  songRef.value.reset()

  emit('newSong', song)
}

defineExpose({
  loadPreset
})
</script>

<style lang="scss" scoped>
  .heading {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
  }

  div.indent {
    margin-left: 20px;
    margin-bottom: 20px;
  }
</style>
