<template lang="pug">
div.d-flex
  v-autocomplete(
    :model-value="modelValue"
    @update:model-value="update"
    clearable
    placeholder="Geen taal geselecteerd"
    label="Taal"
    :items="selectOptions"
    hide-details
  )
  v-btn-toggle.ml-4(:model-value="modelValue" @update:model-value="update" color="blue")
    v-btn(value="en") Engels
    v-btn(value="nl") Nederlands
    v-btn(value="i") Instrumentaal
</template>

<script setup>
import languages from '~/utils/language'

defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const selectOptions = Object.entries(languages).map(([languageId, languageName]) => {
  return {
    value: languageId,
    title: languageName
  }
})

function update(newValue) {
  emit('update:modelValue', newValue)
}
</script>

<style lang="scss" scoped>
div.d-flex {
  align-items: center;
}
</style>