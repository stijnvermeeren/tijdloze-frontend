<template lang="pug">
div.d-flex
  v-text-field(:model-value='modelValue' @update:model-value='update' label="Spotify ID" hide-details)
  v-btn.ml-2(v-if='modelValue' :icon="mdiOpenInNew" :href="link" target="_blank")
</template>

<script setup>
import {mdiOpenInNew} from "@mdi/js";

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const link = computed(() => {
  return `https://open.spotify.com/artist/${props.modelValue}`
})

function update(newValue) {
  emit('update:modelValue', newValue);
}
</script>
