<template>
    <div>
        <div class="toelichting">
            <p><tijdloze-links text="Deze tabel toont welke albums in een bepaalde editie van Tijdloze veel noteringen hadden." /></p>
        </div>

        <table class="lijst perEen">
            <tbody>
                <tr>
                    <th class="r">Jaar</th>
                    <th>
                        <table class="valueData">
                            <tbody>
                                <tr>
                                    <th>Not.</th>
                                    <th class="l">Albums</th>
                                </tr>
                            </tbody>
                        </table>
                    </th>
                </tr>
                <tr v-for="{year, counts} in data">
                    <td class="r"><year-link :year="year" /></td>
                    <td>
                        <table class="valueData">
                            <tbody>
                                <tr v-for="{count, albums} in counts">
                                    <td>{{count}}</td>
                                    <td class="l" v-if="albums">
                                        <template v-for="(album, index) in albums"><span v-if="index > 0">, </span><tijdloze-album :album="album" /> (<tijdloze-artist :artist="album.artist" />)</template>
                                    </td>
                                    <td class="l" v-else>/</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
  import _ from 'lodash'
  import YearLink from "../../../components/YearLink";

  export default {
    components: {YearLink},
    props: ['albums', 'years'],
    computed: {
      data() {
        const MAX = 3;
        const MIN = 2;

        return _.reverse([...this.years]).map(year => {
          const albumsPerCount = _.groupBy(this.albums, album => {
            return album.songs.filter(song => song.position(year)).length;
          });

          const range = _.range(MAX, MIN - 1, -1);
          const counts = range.map(count => {
            return {
              count: count,
              albums: albumsPerCount[count]
            }
          });


          return {
            year: year,
            counts: counts
          };
        });
      }
    },
    head: {
      title: 'Noteringen (albums) per jaar'
    }
  }
</script>
