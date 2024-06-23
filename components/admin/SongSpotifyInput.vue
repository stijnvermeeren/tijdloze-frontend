<template lang="pug">
div.d-flex.align-center
  div.flex-grow-1.d-flex.align-center.mr-3(style="flex-basis: 60%;")
    v-text-field.mr-2(
      :model-value='modelValue'
      @update:model-value='update'
      label="Spotify ID"
      clearable
      :error-messages="spotifyMessage"
    )
    v-btn.mx-1(@click="search" :disabled="processing") Zoek
  div
    spotify(:spotify-id='modelValue' v-if="modelValue")
</template>

<script setup>
import {mdiOpenInNew} from "@mdi/js";

const props = defineProps({
  modelValue: String,
  artist: String,
  album: String,
  title: String
})

const spotifyMessage = ref("")
const processing = ref(false)

const emit = defineEmits(['update:modelValue'])

function update(newValue) {
  emit('update:modelValue', newValue);
}

async function search() {
  const query = `artist:${props.artist} album:${props.album} track:${props.title}`
  processing.value = true
  const {data: result, error} = await useApiFetch('/spotify/find', {params: {query: query}})
  spotifyMessage.value = ""

  if (result.value) {
    processing.value = false
    const spotifyTracks = result.value;
    if (spotifyTracks.length) {
      update(spotifyTracks[0].spotifyId)
    } else {
      spotifyMessage.value = "Niets gevonden op Spotify"
    }
  }
  if (error.value) {
    processing.value = false
    this.spotifyError = "Probleem bij het zoeken op Spotify";
  }
}

defineExpose({
  search
});
</script>
