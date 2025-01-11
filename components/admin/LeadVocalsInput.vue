<template lang="pug">
div.d-flex
  div Lead vocals:
  v-btn-toggle.mx-4(v-model="genderId" color="blue")
    v-btn(
      v-for='[genderId, genderName] in Object.entries(vocalsGenders)'
      :key='genderId'
      :value="genderId"
    ) {{genderName}}
  v-btn(:icon="mdiClose" v-if="genderId" @click="genderId = undefined" size="small")
</template>

<script setup>
import vocalsGenders from '~/utils/leadVocals'
import {mdiClose} from "@mdi/js";

const genderId = defineModel()
</script>

<style lang="scss" scoped>
div.d-flex {
  align-items: center;
}
</style>