<template lang="pug">
div
  h2 Tijdloze talen
  .toelichting
    p
      tijdloze-links(text='Bijna alle nummers in de Tijdloze zijn (hoofdzakelijk) in het Engels gezongen, in de eerste twee edities stonden er zelfs alleen maar Engelstalige nummers in de lijst.')
    p
      tijdloze-links(text="In de jaren '90 kwamen er ook enkele Nederlandstalige nummers de Tijdloze binnengeslopen: [Irene], [Blauw], [Meisjes], [Lieve Kleine Piranha] en natuurlijk [Mia], dat in [2003] zelfs tot op de eerste plaats klom. Na het verdwijnen van de andere nummers is Mia sinds [2009] het enige overblijvende Nederlandstalige nummer in de Tijdloze.")
    p
      tijdloze-links(text="Het Franstalige [Je T'Aime... Moi Non Plus] een maal in de lijst, in [1991].")
    p
      tijdloze-links(text='[Samba Pa Ti] van gitarist [Santana] heeft twee noteringen, en was tot in [2006] het enige instrumentale nummer dat ooit in de Tijdloze stond. Sindsdien zijn er echter nog drie nummers bijgekomen in deze categorie: [Housewife] van [Daan], [The Man with the Red Face] van [Laurent Garnier] en [Universal Nation] van [Push].')

  .scrollbox
    table.lijst
      tbody
        tr
          th.r Land
          th(v-for='year in years') {{year._yy}}
          th.r Tot.
        tr(v-for='{languageId, total, perYear} in counts')
          td.r
            | {{languages[languageId]}}
          td(v-for='{count} in perYear')
            | {{count}}
          td.r
            | {{total}}

  .graph(v-for='{languageId, dataPoints} in graphData')
    tijdloze-distribution-graph(:points='dataPoints' :title='languages[languageId]')
</template>

<script>
  import DistributionGraph from "../../components/d3/DistributionGraph"
  import languages from '~/utils/language'

  export default {
    components: {
      TijdlozeDistributionGraph: DistributionGraph
    },
    computed: {
      years() {
        return this.$store.getters.years;
      },
      languages() {
        return languages;
      },
      graphData() {
        const dataPoints = {};
        const result = Object.keys(languages).map(languageId => {
          dataPoints[languageId] = [];
          return {
            languageId: languageId,
            dataPoints: dataPoints[languageId]
          };
        });

        this.$store.getters.songs.forEach(song => {
          if (song.languageId) {
            this.years.forEach(year => {
              if (song.position(year)) {
                dataPoints[song.languageId].push({
                  song: song,
                  year: year
                });
              }
            });
          }
        });

        // Only return languages with at least on top 100 entry.
        return result.filter(data => data.dataPoints.length)
      },
      counts() {
        return this.graphData.map(({languageId, dataPoints}) => {
          return {
            languageId: languageId,
            total: dataPoints.length,
            perYear: this.years.map(year => {
              return {
                year: year,
                count: dataPoints.filter(dataPoint => dataPoint.year.equals(year)).length
              }
            })
          }
        });
      }
    },
    methods: {
      decadeYear(yyyy) {
        return yyyy - yyyy % 10;
      }
    },
    head: {
      title: 'Talen'
    },
    ssrComputedCache: true
  }
</script>
