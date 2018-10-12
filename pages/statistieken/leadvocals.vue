<template>
    <div>
        <h2>Lead vocals</h2>

        <div class="toelichting">
            <p><tijdloze-links text="De Tijdloze werd altijd al gedomineerd door mannen. Het is echter niet gemakkelijk om hierover ondubbelzinnige statistieken te maken. Het meest markante geval is [Massive Attack]. Hoewel de groep zelf enkel uit mannen bestaat, zijn beide Tijdloze nummers van de band wel door vrouwen gezongen ([Unfinished Sympathy] door Shara Nelson en [Teardrop] door Elizabeth Fraser). Omdat het geslacht van de bandleden alleen in de stemmen van de vocalisten hoorbaar is, concentreren we ons hierop." /></p>
            <p><tijdloze-links text="Twee artiesten hebben Tijdloze nummers die in verschillende categoriën vallen. Bij [Fleetwood Mac] werd [Go Your Own Way] gezongen door een man (Lindsey Buckingham) en [Dreams] door een vrouw (Stevie Nicks). [Meat Loaf] zong zelf op [I'd Do Anything For Love (But I Won't Do That)] en zong in duet met Ellen Foley op [Paradise by the Dashboard Light]. Het enige andere duet dat ooit in de Tijdloze stond is [Je T'Aime... Moi Non Plus]." /></p>
        </div>

        <div class="scrollbox">
            <table class="lijst">
                <tbody>
                    <tr>
                        <th class="r">Lead vocals</th>
                        <th v-for="year in years">{{year._yy}}</th>
                        <th class="r">Tot.</th>
                    </tr>
                    <tr v-for="{vocalsGender, total, perYear} in counts">
                        <td class="r">
                            {{vocalsGender.name}}
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

        <div v-for="{vocalsGender, dataPoints} in graphData" class="graph">
            <tijdloze-distribution-graph :points="dataPoints" :title="vocalsGender.name" />
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
      vocalsGenders() {
        return this.$store.state.vocalsGenders;
      },
      graphData() {
        const dataPoints = {};
        const result = this.vocalsGenders.map(vocalsGender => {
          dataPoints[vocalsGender.id] = [];
          return {
            vocalsGender: vocalsGender,
            dataPoints: dataPoints[vocalsGender.id]
          };
        });

        this.$store.getters.songs.forEach(song => {
          this.years.forEach(year => {
            if (song.position(year)) {
              dataPoints[song.leadVocals].push({
                song: song,
                year: year
              });
            }
          });
        });

        return result;
      },
      counts() {
        return this.graphData.map(({vocalsGender, dataPoints}) => {
          return {
            vocalsGender: vocalsGender,
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
      title: 'Lead Vocals'
    }
  }
</script>
