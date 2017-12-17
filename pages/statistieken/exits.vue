<template>
    <div>
        <h2>Tijdloze exits</h2>

        <tijdloze-tabs :tabs="[
            { to: '/statistieken/exits', title: 'Per jaar' },
            { to: '/statistieken/exits/lijst', title: 'Hoogste aller tijden' },
            { to: '/statistieken/exits/grafiek', title: 'Op grafiek' }
          ]">
            <nuxt-child :data="data" :years="years" />
        </tijdloze-tabs>
    </div>
</template>

<script>
  export default {
    computed: {
      years() {
        return this.$store.getters.years;
      },
      songs() {
        return this.$store.getters.songs;
      },
      data() {
        const dataPoints = [];
        this.songs.forEach(song => {
          let inPreviousList = false;
          this.years.forEach(year => {
            if (inPreviousList && song.notInList(year)) {
              dataPoints.push({
                song: song,
                year: year.previous()
              });
            }

            inPreviousList = song.position(year) > 0;
          });
        });
        return dataPoints;
      }
    },
    head: {
      title: 'Exits'
    }
  }
</script>
