<template lang="pug">
div.d-flex
  v-text-field(:model-value='modelValue' @update:model-value='update' label="Musicbrainz Id" hide-details)
  v-btn.ml-2(v-if='modelValue' :icon="mdiOpenInNew" :href="visitUrl" target="_blank")
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

function update(newValue) {
  emit('update:modelValue', newValue);
}
</script>
