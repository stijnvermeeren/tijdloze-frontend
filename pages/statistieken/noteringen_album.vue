<template lang="pug">
Title Noteringen (albums)
div
  h2 Tijdloze Noteringen (Albums)
  ui-tabs(:tabs="[\
    { to: '/statistieken/noteringen_album', title: 'In totaal' },\
    { to: '/statistieken/noteringen_album/perjaar', title: 'Per jaar' },\
    { to: '/statistieken/noteringen_album/nummers', title: 'Verschillende nummers' }\
  ]")
    nuxt-page(:albums='albums' :years='years')
</template>

<script setup>
import Album from "@/orm/Album";
import {useRepo} from "pinia-orm";

const {years} = storeToRefs(useYearStore())
const albums = computed(() => {
  return useRepo(Album).withAll().get();
})

definePageMeta({
  noScrollDepth: 2
})
</script>
