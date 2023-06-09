<template lang="pug">
div.d-flex
  v-text-field(:model-value='modelValue' @update:model-value='update' :label="label" hide-details)
  v-btn.ml-2(v-if='modelValue' :icon="mdiOpenInNew" :href="modelValue" target="_blank")
  v-btn.ml-2(v-if='query' :icon="mdiSearchWeb" :href="searchUrl" target="_blank")
</template>

<script setup>
import {mdiOpenInNew, mdiSearchWeb} from "@mdi/js";

const props = defineProps({
  modelValue: String,
  lang: String,
  query: String
})

const emit = defineEmits(['update:modelValue'])

const label = computed(() => {
  switch (props.lang) {
    case "nl": return "Wikipedia (Nederlands)"
    case "en": return "Wikipedia (Engels)"
    default: return `Wikipedia (${props.lang})`
  }
})

const searchUrl = computed(() => {
  const encodedQuery = encodeURIComponent(props.query)
  return `https://${props.lang}.wikipedia.org/w/index.php?search=${encodedQuery}`
})

function update(newValue) {
  emit('update:modelValue', newValue);
}
</script>
