<template lang="pug">
div.d-flex.align-center
  div.flex-grow-1.d-flex.align-center.mr-3(style="flex-basis: 60%;")
    v-text-field.mr-2(
      v-model="spotifyId"
      label="Spotify ID"
      clearable
      :error-messages="spotifyMessage"
    )
    v-btn.mx-1(@click="search" :disabled="processing") Zoek
  div
    spotify(:spotify-id='spotifyId' v-if="spotifyId")
</template>

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
import {mdiOpenInNew} from "@mdi/js";

const {$api} = useNuxtApp()

const spotifyId = defineModel<string>()

const props = defineProps<{
  artist?: string
  album?: string
  title: string
}>()

const spotifyMessage = ref("")
const processing = ref(false)

async function search() {
  const queryParts: string[] = []
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
  const spotifyTracks = await $api(apiEndpoints.spotify.find(), { params: {query} }).catch(err => {
    processing.value = false
    spotifyId.value = ''
    spotifyMessage.value = "Probleem bij het zoeken op Spotify";
    return undefined
  })
  spotifyMessage.value = ""

  if (spotifyTracks) {
    processing.value = false
    if (spotifyTracks.length) {
      spotifyId.value = spotifyTracks[0]!.spotifyId
    } else {
      spotifyId.value = ''
      spotifyMessage.value = "Niets gevonden op Spotify"
    }
  }
}

defineExpose({
  search
});
</script>
