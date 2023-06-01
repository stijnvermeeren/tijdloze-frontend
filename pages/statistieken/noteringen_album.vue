<template lang="pug">
Title Noteringen (albums)
div
  h2 Tijdloze Noteringen (Albums)
  tabs(:tabs="[\
    { to: '/statistieken/noteringen_album', title: 'In totaal' },\
    { to: '/statistieken/noteringen_album/perjaar', title: 'Per jaar' },\
    { to: '/statistieken/noteringen_album/nummers', title: 'Verschillende nummers' }\
  ]")
    nuxt-page(:albums='albums' :years='years')
</template>

<script>
  import Album from "@/orm/Album";
  import {useRootStore} from "~/stores/root";
  import {useRepo} from "pinia-orm";

  export default {
    computed: {
      years() {
        return useRootStore().years;
      },
      albums() {
        return useRepo(Album).withAll().get();
      }
    }
  }
</script>
