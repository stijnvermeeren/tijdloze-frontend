<template lang="pug">
  div
    h2 Lead vocals
    .toelichting
      p
        tijdloze-links(text='De Tijdloze werd altijd al gedomineerd door mannen. Het is echter niet gemakkelijk om hierover ondubbelzinnige statistieken te maken. Het meest markante geval is [Massive Attack]. Hoewel de groep zelf enkel uit mannen bestaat, zijn beide Tijdloze nummers van de band wel door vrouwen gezongen ([Unfinished Sympathy] door Shara Nelson en [Teardrop] door Elizabeth Fraser). Omdat het geslacht van de bandleden alleen in de stemmen van de vocalisten hoorbaar is, concentreren we ons hierop.')
      p
        tijdloze-links(text="Twee artiesten hebben Tijdloze nummers die in verschillende categoriën vallen. [Meat Loaf] zong zelf op [I'd Do Anything For Love (But I Won't Do That)] en zong in duet met Ellen Foley op [Paradise by the Dashboard Light]. De nummers van [Fleetwood Mac] vallen zelfs in drie categorieën: [Go Your Own Way] werd gezongen door een man (Lindsey Buckingham), [Dreams] en [Everywhere] werden gezongen door een vrouw (respectievelijk Stevie Nicks en Christine McVie) en op [The Chain] zingen deze drie zoveel samen, dat het nummer hier als duet geteld word.")
      p
        tijdloze-links(text="Naast Meat Loaf en Fleetwood Mac stond er ooit nog een ander duet in de Tijdloze: [Je T'Aime... Moi Non Plus] van [Serge Gainsbourg & Jane Birkin].")
    .scrollbox
      table.lijst
        tbody
          tr
            th.r Lead vocals
            th(v-for='year in years') {{year._yy}}
            th.r Tot.
          tr(v-for='{vocalsGender, total, perYear} in counts')
            td.r
              | {{vocalsGender.name}}
            td(v-for='{count} in perYear')
              | {{count}}
            td.r
              | {{total}}
    .graph(v-for='{vocalsGender, dataPoints} in graphData')
      tijdloze-distribution-graph(:points='dataPoints' :title='vocalsGender.name')
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
          if (song.leadVocals) {
            this.years.forEach(year => {
              if (song.position(year)) {
                dataPoints[song.leadVocals].push({
                  song: song,
                  year: year
                });
              }
            });
          }
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
