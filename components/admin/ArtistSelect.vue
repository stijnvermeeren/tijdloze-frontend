<template lang="pug">
v-autocomplete(
  v-model:search="keyword"
  :model-value="modelValue"
  @update:model-value='update'
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
  modelValue: {
    type: Number
  },
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

const keyword = ref('');

const candidateArtists = computed(() => {
  const queryFragments = useSearchQueryFragments(keyword.value)
  return _.sortBy(
      useSearchFilter(queryFragments, useRepo(Artist).all(), useSearchArtistContent),
      artist => -useSearchScore(keyword.value, useSearchArtistContent(artist))
  ).map(artist => {
    return {
      value: artist.id,
      title: artist.name
    }
  })
})

const emit = defineEmits(['update:modelValue'])

function update(newValue) {
  if (newValue) {
    emit('update:modelValue', newValue);
  }
}
</script>
