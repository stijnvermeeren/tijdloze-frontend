<template lang="pug">
div.d-flex
  v-text-field(:model-value='modelValue' @update:model-value='update' label="Officiële website" hide-details)
  v-btn.ml-2(v-if='modelValue' :icon="mdiOpenInNew" :href="modelValue" target="_blank")
  v-btn.ml-2(v-if='query' :icon="mdiSearchWeb" :href="searchUrl" target="_blank")
</template>

<script setup>
import {mdiOpenInNew, mdiSearchWeb} from "@mdi/js";

const props = defineProps({
  modelValue: String,
  query: String
})

const emit = defineEmits(['update:modelValue'])

const searchUrl = computed(() => {
  const encodedQuery = encodeURIComponent(props.query)
  return `https://www.google.ch/search?q=${encodedQuery}`
})

function update(newValue) {
  emit('update:modelValue', newValue);
}
</script>
<style scoped>
  input {
    box-sizing: border-box;
    width: 100%;
  }

  div.visit, div.search {
    display: inline-block;
    padding: 1px 15px;
    font-size: 14px;
  }
</style>
