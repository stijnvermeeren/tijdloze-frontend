<template lang="pug">
v-autocomplete(
  v-model:search="keyword"
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

<script setup>
import _ from "lodash";
import {useRepo} from "pinia-orm";
import Artist from "~/orm/Artist";

const props = defineProps({
  label: {
    type: String,
    default: "Artiest"
  },
  required: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const artistId = defineModel()

const keyword = ref('');

const candidateArtists = computed(() => {
  const queryFragments = useSearchQueryFragments(keyword.value)
  return _.sortBy(
      useRepo(Artist).all().filter(useSearchFilter(queryFragments, useSearchArtistContent)),
      artist => -useSearchScore(keyword.value, useSearchArtistContent(artist))
  ).map(artist => {
    return {
      value: artist.id,
      title: artist.name
    }
  })
})
</script>
