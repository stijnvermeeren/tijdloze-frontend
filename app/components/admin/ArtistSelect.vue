<template lang="pug">
v-autocomplete(
  v-model:search="query"
  v-model="artistId"
  :items="candidateArtists"
  :label="label"
  :disabled="disabled"
  :clearable="!required"
  :persistent-clear="!required"
  hide-details
  no-filter
)
</template>

<script setup lang="ts">
import {useRepo} from "pinia-orm";
import Artist from "~/orm/Artist";
import { sortBy } from 'ramda'

withDefaults(defineProps<{
  label?: string
  required?: boolean
  disabled?: boolean
}>(), {
  label: "Artiest",
  required: true,
  disabled: false
})

const artistId = defineModel<number | undefined>()

const query = ref('')

watch(artistId, (newArtistId) => {
  if (!newArtistId) {
    return
  }
  const artist = useRepo(Artist).find(newArtistId)
  if (artist) {
    query.value = artist.name
  }
})

const candidateArtists = computed(() => {
  const queryFragments = useSearchQueryFragments(query.value)
  return sortBy(
    (artist: Artist) => -useSearchScore(query.value, useSearchArtistContent(artist)),
    useRepo(Artist).all()
    .filter(useSearchFilter(queryFragments, useSearchArtistContent))
  )
    .map((artist: Artist) => {
    return {
      value: artist.id,
      title: artist.name
    }
  })
})
</script>
