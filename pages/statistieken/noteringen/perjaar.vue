<template lang="pug">
div
  .toelichting
    p
      tijdloze-links(text="Deze tabel toont welke artisten in een bepaalde Tijdloze veel nummers hadden. Vier noteringen in een jaar komt wel vaker voor, maar slechts vier artiesten hadden ooit vijf nummers in eenzelfde Tijdloze lijst: [U2], [The Rolling Stones], [dEUS] en [Radiohead]. [U2] presteerde het in [1992] zelfs om zes nummers in de Tijdloze te hebben, een record dat in ['99], ['02] en ['03] evenaard werd door [dEUS]. Tot en met [2016] hadden [The Rolling Stones] minstens drie nummers in elke Tijdloze. Nu is er geen enkele artiest meer die dat nog kan zeggen.")

  table.lijst.perEen
    tbody
      tr
        th.r Jaar
        th
          table.valueData
            tbody
              tr
                th Not.
                th.l Artiesten
      tr(v-for='{year, counts} in data')
        td.r
          year-link(:year='year')
        td
          table.valueData
            tbody
              tr(v-for='{count, artists} in counts')
                td {{count}}
                td.l(v-if='artists')
                  span(v-for='(artist, index) in artists')
                    template(v-if='index > 0')
                      | ,
                      |
                    tijdloze-artist(:artist='artist')
                td.l(v-else) /
</template>

<script>
  import _ from 'lodash'
  import YearLink from "../../../components/YearLink";

  export default {
    components: {YearLink},
    props: {
      artists: Array,
      years: Array
    },
    computed: {
      data() {
        const MAX = 6;
        const MIN = 3;

        return _.reverse([...this.years]).map(year => {
          const artistsPerCount = _.groupBy(this.artists, artist => {
            return artist.allSongs.filter(song => song.position(year)).length;
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
