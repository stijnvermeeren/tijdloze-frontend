<template>

    <table class="lijst perEen">
        <tbody>
            <tr>
                <th class="r">Aantal jaren</th>
                <th>
                    <table class="valueValueDataData">
                        <tr>
                            <th class="i">Jaren</th>
                            <th class="i">Positie</th>
                            <th class="a">Artiest</th>
                            <th>Nummer</th>
                        </tr>
                    </table>
                </th>
            </tr>
            <tr v-for="data in byNumberOfYears">
                <td class="r">{{data.numberOfYears}}</td>
                <td>
                    <table class="valueValueDataData">
                        <tbody>
                            <tr v-for="entry in data.entries">
                                <td class="i">
                                    {{entry.years[0].yyyy}}-{{entry.years[entry.years.length - 1].yyyy}}
                                </td>
                                <td class="i">
                                    {{entry.song.position(entry.years[0])}}
                                </td>
                                <td class="a"><tijdloze-artist :artist="$store.getters.artistsById[entry.song.artistId]" /></td>
                                <td><tijdloze-song :song="entry.song" /></td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
  import ranking from '../../../store/ranking';
  import _ from 'lodash';

  export default {
    props: ['years'],
    computed: {
      songs() {
        return this.$store.getters.songs;
      },
      byNumberOfYears() {
        let data = [];
        let maxYears = 0;
        this.songs.forEach(song => {
          song.stationaryIntervals()
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
