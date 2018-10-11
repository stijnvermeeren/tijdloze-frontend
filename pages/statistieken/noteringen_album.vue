<template>
    <div>
        <h2>Tijdloze Noteringen (Albums)</h2>

        <tijdloze-tabs :tabs="[
            { to: '/statistieken/noteringen_album', title: 'In totaal' },
            { to: '/statistieken/noteringen_album/perjaar', title: 'Per jaar' },
            { to: '/statistieken/noteringen_album/nummers', title: 'Verschillende nummers' }
          ]">
            <nuxt-child :albums="albums" :years="years" />
        </tijdloze-tabs>
    </div>
</template>

<script>
  export default {
    computed: {
      years() {
        return this.$store.getters.years;
      },
      albums() {
        return this.$store.getters['entities/albums']().withAll().all();
      }
    },
    head: {
      title: 'Noteringen (albums)'
    }
  }
</script>
