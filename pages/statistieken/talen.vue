<template>
    <div>
        <h2>Tijdloze talen</h2>

        <div class="toelichting">
            <p><tijdloze-links text="Bijna alle nummers in de Tijdloze zijn (hoofdzakelijk) in het Engels gezongen, in de eerste twee edities stonden er zelfs alleen maar Engelstalige nummers in de lijst." /></p>
            <p><tijdloze-links text="In de jaren '90 kwamen er ook enkele Nederlandstalige nummers de Tijdloze binnengeslopen: [Irene], [Blauw], [Meisjes], [Lieve Kleine Piranha] en natuurlijk [Mia], dat in [2003] zelfs tot op de eerste plaats klom. Na het verdwijnen van de andere nummers is Mia sinds [2009] het enige overblijvende Nederlandstalige nummer in de Tijdloze." /></p>
            <p><tijdloze-links text="Het Franstalige [Je T'Aime... Moi Non Plus] een maal in de lijst, in [1991]." /></p>
            <p><tijdloze-links text="[Samba Pa Ti] van gitarist [Santana] heeft twee noteringen, en was tot in [2006] het enige instrumentale nummer dat ooit in de Tijdloze stond. Sindsdien zijn er echter nog drie nummers bijgekomen in deze categorie: [Housewife] van [Daan], [The Man with the Red Face] van [Laurent Garnier] en [Universal Nation] van [Push]." /></p>
        </div>

        <div class="scrollbox">
            <table class="lijst">
                <tbody>
                <tr>
                    <th class="r">Land</th>
                    <th v-for="year in years">{{year._yy}}</th>
                    <th class="r">Tot.</th>
                </tr>
                <tr v-for="{language, total, perYear} in counts">
                    <td class="r">
                        {{language.name}}
                    </td>
                    <td v-for="{count} in perYear">
                        {{count}}
                    </td>
                    <td class="r">
                        {{total}}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div v-for="{language, dataPoints} in graphData" class="graph">
            <tijdloze-distribution-graph :points="dataPoints" :title="language.name" />
        </div>
    </div>
</template>

<script>
  import DistributionGraph from "../../components/d3/DistributionGraph"
  import _ from 'lodash';

  export default {
    components: {
      TijdlozeDistributionGraph: DistributionGraph
    },
    computed: {
      years() {
        return this.$store.getters.years;
      },
      languages() {
        return _.sortBy(
          this.$store.state.languages,
          language => language.name
        );
      },
      graphData() {
        const dataPoints = {};
        const result = this.languages.map(language => {
          dataPoints[language.id] = [];
          return {
            language: language,
            dataPoints: dataPoints[language.id]
          };
        });

        this.$store.getters.songs.forEach(song => {
          this.years.forEach(year => {
            if (song.position(year)) {
              dataPoints[song.languageId].push({
                song: song,
                year: year
              });
            }
          });
        });

        return result;
      },
      counts() {
        return this.graphData.map(({language, dataPoints}) => {
          return {
            language: language,
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
    }
  }
</script>
