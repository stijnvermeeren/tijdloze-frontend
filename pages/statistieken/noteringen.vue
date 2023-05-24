<template lang="pug">
div
  h2 Tijdloze Noteringen
  tijdloze-tabs(:tabs="[\
    { to: '/statistieken/noteringen', title: 'In totaal' },\
    { to: '/statistieken/noteringen/perjaar', title: 'Per jaar' },\
    { to: '/statistieken/noteringen/nummers', title: 'Verschillende nummers' }\
  ]")
    nuxt-child(:artists='artists' :years='years')
</template>

<script>
  import Artist from "@/orm/Artist";

  export default {
    computed: {
      years() {
        return this.$store.getters.years;
      },
      artists() {
        return Artist.query()
          .with('songs')
          .with('secondarySongs')
          .all();
      }
    },
    head: {
      title: 'Noteringen'
    },
    ssrComputedCache: true
  }
</script>
