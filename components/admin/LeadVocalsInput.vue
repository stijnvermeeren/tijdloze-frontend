<template lang="pug">
div.d-flex
  div Lead vocals:
  v-btn-toggle.mx-4(:model-value='modelValue' @update:model-value="update" color="blue")
    v-btn(
      v-for='[genderId, genderName] in Object.entries(vocalsGenders)'
      :key='genderId'
      :value="genderId"
    ) {{genderName}}
  v-btn(:icon="mdiClose" v-if="modelValue" @click="update(undefined)" size="small")
</template>

<script setup>
import vocalsGenders from '~/utils/leadVocals'
import {mdiClose} from "@mdi/js";

defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

function update(newValue) {
  emit('update:modelValue', newValue);
}
</script>

<style lang="scss" scoped>
div.d-flex {
  align-items: center;
}
</style>