<template>
    <div>
        <h2>Tijdloze stijgers</h2>

        <tijdloze-tabs :tabs="[
            { to: '/statistieken/stijgers', title: 'Per jaar' },
            { to: '/statistieken/stijgers/lijst', title: 'Grootste aller tijden' }
          ]">
            <nuxt-child :data="data" :years="years" />
        </tijdloze-tabs>
    </div>
</template>

<script>
  import _ from 'lodash';

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
          _.drop(this.years, 1).forEach(year => {
            const oldPosition = song.position(year.previous());
            const newPosition = song.position(year);
            if (oldPosition && newPosition && oldPosition > newPosition) {
              dataPoints.push({
                song,
                year,
                oldPosition,
                newPosition
              });
            }
          });
        });
        return dataPoints;
      }
    },
    head: {
      title: 'Stijgers'
    }
  }
</script>
