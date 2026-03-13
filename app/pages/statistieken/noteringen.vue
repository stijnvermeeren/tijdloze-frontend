<template lang="pug">
Title Noteringen
div
  h2 Tijdloze Noteringen
  ui-tabs(:tabs="tabs")
    nuxt-page(:artists='artists' :years='years')
</template>

<script setup lang="ts">
import Artist from "~/orm/Artist";
import {useRepo} from "pinia-orm";

const tabs = [
  { to: '/statistieken/noteringen', title: 'In totaal' },
  { to: '/statistieken/noteringen/perjaar', title: 'Per jaar' },
  { to: '/statistieken/noteringen/nummers', title: 'Verschillende nummers' }
]

const {years} = storeToRefs(useYearStore())
const artists = computed(() => {
  return useRepo(Artist)
    .with('songs')
    .with('secondarySongs')
    .get();
})

definePageMeta({
  noScrollDepth: 2
})
</script>
