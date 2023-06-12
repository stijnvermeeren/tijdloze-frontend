<template lang="pug">
v-select(
  :model-value='modelValue'
  @update:model-value='input'
  label="Lead vocals"
  clearable
  density="compact"
  :items="items"
  hide-details
)
</template>

<script>
  import vocalsGenders from '~/utils/leadVocals'
  import languages from "~/utils/language";

  export default {
    props: {
      modelValue: String
    },
    emits: ['update:modelValue'],
    computed: {
      items() {
        return Object.entries(vocalsGenders).map(([genderId, genderName]) => {
          return {
            title: genderName,
            value: genderId,
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
