<template lang="pug">
  div
    h2 Tijdloze Noteringen (Albums)
    tijdloze-tabs(:tabs="[\
      { to: '/statistieken/noteringen_album', title: 'In totaal' },\
      { to: '/statistieken/noteringen_album/perjaar', title: 'Per jaar' },\
      { to: '/statistieken/noteringen_album/nummers', title: 'Verschillende nummers' }\
    ]")
      nuxt-child(:albums='albums' :years='years')

</template>

<script>
  import Album from "@/orm/Album";

  export default {
    computed: {
      years() {
        return this.$store.getters.years;
      },
      albums() {
        return Album.query().withAll().all();
      }
    },
    head: {
      title: 'Noteringen (albums)'
    }
  }
</script>
