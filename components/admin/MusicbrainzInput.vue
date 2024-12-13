<template lang="pug">
div.d-flex
  v-text-field(:model-value='modelValue' @update:model-value='update' label="Musicbrainz Id" hide-details)
  v-btn.ml-2(v-if='modelValue' :icon="mdiOpenInNew" :href="visitUrl" target="_blank")
  v-btn.ml-2(v-if='query' :icon="mdiSearchWeb" :href="searchUrl" target="_blank")
</template>

<script setup>
import {mdiOpenInNew, mdiSearchWeb} from "@mdi/js";

const props = defineProps({
  modelValue: String,
  musicbrainzCategory: String,
  query: String
})

const emit = defineEmits(['update:modelValue'])

const visitUrl = computed(() => {
  return `https://musicbrainz.org/${props.musicbrainzCategory}/${props.modelValue}`
})

const searchUrl = computed(() => {
  const encodedQuery = encodeURIComponent(props.query).replaceAll("%20", "+")
  let type = props.musicbrainzCategory
  if (type == 'release-group') {
    type = 'release_group'
  }
  return `https://musicbrainz.org/search?query=${encodedQuery}&type=${type}&limit=25&method=indexed`
})

function update(newValue) {
  emit('update:modelValue', newValue);
}
</script>
