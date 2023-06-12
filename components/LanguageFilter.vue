<template lang="pug">
v-select(
  :model-value='modelValue'
  @update:model-value='input'
  :items="items"
  label="Taal"
  clearable
  density="compact"
  hide-details
)
</template>

<script>
  import languages from '~/utils/language'

  export default {
    props: {
      modelValue: String
    },
    emits: ['update:modelValue'],
    computed: {
      items() {
        return Object.entries(languages).map(([languageId, languageName]) => {
          return {
            title: languageName,
            value: languageId,
          }
        })
      }
    },
    methods: {
      input(newValue) {
        this.$emit('update:modelValue', newValue);
      }
    }
  }
</script>
