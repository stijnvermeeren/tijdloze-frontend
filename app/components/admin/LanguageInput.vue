<template lang="pug">
div.d-flex
  v-autocomplete(
    v-model="languageId"
    clearable
    placeholder="Geen taal geselecteerd"
    label="Taal"
    :items="selectOptions"
    hide-details
  )
  v-btn-toggle.ml-4(v-model="languageId" color="blue")
    v-btn(value="en") Engels
    v-btn(value="nl") Nederlands
    v-btn(value="i") Instrumentaal
</template>

<script setup>
import languages from '~/utils/language'

const languageId = defineModel()

const selectOptions = Object.entries(languages).map(([languageId, languageName]) => {
  return {
    value: languageId,
    title: languageName
  }
})
</script>

<style lang="scss" scoped>
div.d-flex {
  align-items: center;
}
</style>