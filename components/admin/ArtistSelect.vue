<template lang="pug">
v-autocomplete(
  :model-value="modelValue"
  @update:model-value='update'
  :items="candidateArtists"
  :label="label"
  :disabled="disabled"
  :clearable="!required"
  :persistent-clear="!required"
  hide-details
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

const candidateArtists = computed(() => {
  return _.sortBy(
      useRepo(Artist).all(),
      artist => artist.name
  ).map(artist => {
    return {
      value: artist.id,
      title: artist.name
    }
  })
})

const emit = defineEmits(['update:modelValue'])

function update(newValue) {
  emit('update:modelValue', newValue);
}
</script>
