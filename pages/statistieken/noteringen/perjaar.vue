<template>
    <div>
        <div class="toelichting">
            <p><tijdloze-links text="Deze tabel toont welke artisten in een bepaalde Tijdloze veel nummers hadden. Vier noteringen in een jaar komt wel vaker voor, maar slechts vier artiesten hadden ooit vijf nummers in eenzelfde Tijdloze lijst: [U2], [The Rolling Stones], [dEUS] en [Radiohead]. [U2] presteerde het in [1992] zelfs om zes nummers in de Tijdloze te hebben, een record dat in ['99], ['02] en ['03] evenaard werd door [dEUS]. [The Rolling Stones] zijn, sinds de exit van [U2]'s [Sunday Bloody Sunday] in [2013], de enige band met minstens drie nummers in elke Tijdloze." /></p>
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
                                    <th class="l"><nuxt-link to="/artiesten">Artiesten</nuxt-link></th>
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
                                <tr v-for="{count, artists} in counts">
                                    <td>{{count}}</td>
                                    <td class="l" v-if="artists">
                                        <span v-for="(artist, index) in artists">
                                            <span v-if="index > 0">, </span>
                                            <tijdloze-artist :artist="artist" />
                                        </span>
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
    props: ['artists', 'years'],
    computed: {
      data() {
        const MAX = 6;
        const MIN = 3;

        return _.reverse([...this.years]).map(year => {
          const artistsPerCount = _.groupBy(this.artists, artist => {
            return artist.songs.filter(song => song.position(year)).length;
          });

          const range = _.range(MAX, MIN - 1, -1);
          const counts = range.map(count => {
            return {
              count: count,
              artists: artistsPerCount[count]
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
      title: 'Noteringen per jaar'
    }
  }
</script>
