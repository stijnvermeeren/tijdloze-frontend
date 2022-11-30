<template lang="pug">
  table.lijst.perEen
    tbody
      tr
        th.r Aantal jaren
        th
          table.valueValueDataData
            tr
              th.i Jaren
              th.i Positie
              th.a Artiest
              th Nummer
      tr(v-for='data in byNumberOfYears')
        td.r {{data.numberOfYears}}
        td
          table.valueValueDataData
            tbody
              tr(v-for='entry in data.entries')
                td.i
                  | {{entry.years[0].yyyy}}-{{entry.years[entry.years.length - 1].yyyy}}
                td.i
                  | {{entry.song.position(entry.years[0])}}
                td.a
                  tijdloze-song-artist(:song='entry.song')
                td
                  tijdloze-song(:song='entry.song')

</template>

<script>
  import ranking from '../../../store/ranking';
  import _ from 'lodash';

  export default {
    props: {
      years: Array
    },
    computed: {
      songs() {
        return this.$store.getters.songs;
      },
      byNumberOfYears() {
        let data = [];
        let maxYears = 0;
        this.songs.forEach(song => {
          song.stationaryIntervals(this.$store.getters.years)
            .filter(interval => interval.length > 2)
            .map(interval => {
              maxYears = Math.max(maxYears, interval.length);
              data.push({
                song,
                years: interval,
                position: song.position(_.first(interval))
              });
            })
        });

        return _.rangeRight(3, maxYears + 1).map(numberOfYears => {
          const entries = _.sortBy(
            data.filter(item => item.years.length === numberOfYears),
            [data => -data.years[0].yyyy, data => data.song.position(data.years[0])]
          );

          return {numberOfYears, entries};
        });
      }
    }
  }
</script>
