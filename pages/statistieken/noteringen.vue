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
  export default {
    computed: {
      years() {
        return this.$store.getters.years;
      },
      artists() {
        return this.$store.getters['entities/artists']().with('songs').all();
      }
    },
    head: {
      title: 'Noteringen'
    }
  }
</script>
