<template>
    <div class="scrollbox">
        <table class="lijst">
            <tbody>
            <tr>
                <th class="r"></th>
                <th v-for="year in years">{{year._yy}}</th>
                <th class="r">Algemeen</th>
            </tr>
            <tr v-for="{cutoff, cutoffData, total} in data">
                <td class="r">
                    Top {{cutoff}}
                </td>
                <td v-for="{average} in cutoffData">
                    {{Math.round(average * 10) / 10}}
                </td>
                <td class="r">
                    {{Math.round(total * 10) / 10}}
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    data() {
      return {
        cutoffs: [3, 10, 20, 50, 100]
      }
    },
    computed: {
      years() {
        return this.$store.getters.years;
      },
      data() {
        const years = this.years;
        const songs = this.$store.getters.songs;

        return this.cutoffs.map(cutoff => {
          const cutoffData = years.map(year => {
            const ages = [];

            songs.forEach(song => {
              if (song.position(year) && song.position(year) <= cutoff) {
                ages.push(year.yyyy - song.album.releaseYear);
              }
            });

            return {
              year: year,
              size: ages.length,
              average: _.sum(ages) / ages.length
            }
          });

          const agesSum = _.sumBy(cutoffData, yearData => yearData.size * yearData.average);
          const sizeSum = _.sumBy(cutoffData, yearData => yearData.size);
          const total = agesSum / sizeSum;

          return {
            cutoff: cutoff,
            cutoffData: cutoffData,
            total: total
          }
        });
      }
    }
  }
</script>
