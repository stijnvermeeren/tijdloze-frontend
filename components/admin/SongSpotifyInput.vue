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

const {$api} = useNuxtApp()

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
  const queryParts = []
  if (props.artist) {
    queryParts.push(`artist:"${props.artist.replace('"', "")}"`)
  }
  if (props.album) {
    queryParts.push(`album:"${props.album.replace('"', "")}"`)
  }
  if (props.title) {
    queryParts.push(`track:"${props.title.replace('"', "")}"`)
  }
  const query = queryParts.join(" ")
  processing.value = true
  const spotifyTracks = await $api('/spotify/find', useFetchOpts({params: {query: query}})).catch(err => {
    processing.value = false
    spotifyMessage.value = "Probleem bij het zoeken op Spotify";
  })
  spotifyMessage.value = ""

  if (spotifyTracks) {
    processing.value = false
    if (spotifyTracks.length) {
      update(spotifyTracks[0].spotifyId)
    } else {
      spotifyMessage.value = "Niets gevonden op Spotify"
    }
  }
}

defineExpose({
  search
});
</script>
