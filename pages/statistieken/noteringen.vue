<template lang="pug">
Title Noteringen
div
  h2 Tijdloze Noteringen
  tabs(:tabs="[\
    { to: '/statistieken/noteringen', title: 'In totaal' },\
    { to: '/statistieken/noteringen/perjaar', title: 'Per jaar' },\
    { to: '/statistieken/noteringen/nummers', title: 'Verschillende nummers' }\
  ]")
    nuxt-page(:artists='artists' :years='years')
</template>

<script>
  import Artist from "@/orm/Artist";
  import {useRootStore} from "~/stores/root";
  import {useRepo} from "pinia-orm";

  export default {
    computed: {
      years() {
        return useRootStore().years;
      },
      artists() {
        return useRepo(Artist)
          .with('songs')
          .with('secondarySongs')
          .get();
      }
    }
  }
</script>
