<template lang="pug">
v-select(
  v-model='model'
  :items="items"
  label="Taal"
  clearable
  density="compact"
  hide-details
)
</template>

<script setup>
import languages from '~/utils/language'

const model = defineModel()

const items = Object.entries(languages).map(([languageId, languageName]) => {
  return {
    title: languageName,
    value: languageId,
  }
})
</script>
