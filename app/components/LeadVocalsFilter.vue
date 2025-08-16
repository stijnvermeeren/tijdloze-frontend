<template lang="pug">
v-select(
  v-model="model"
  label="Lead vocals"
  clearable
  density="compact"
  :items="items"
  hide-details
)
</template>

<script setup>
import vocalsGenders from '~/utils/leadVocals'

const model = defineModel()

const items = Object.entries(vocalsGenders).map(([genderId, genderName]) => {
  return {
    title: genderName,
    value: genderId,
  }
})
</script>
