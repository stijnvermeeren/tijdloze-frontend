<template lang="pug">
Title Lead Vocals
div
  h2 Lead vocals
  .toelichting
    p
      make-links(text='De Tijdloze werd altijd al gedomineerd door mannen. Het is echter niet gemakkelijk om hierover ondubbelzinnige statistieken te maken. Het meest markante geval is [Massive Attack]. Hoewel de groep zelf enkel uit mannen bestaat, zijn beide Tijdloze nummers van de band wel door vrouwen gezongen ([Unfinished Sympathy] door Shara Nelson en [Teardrop] door Elizabeth Fraser). Omdat het geslacht van de bandleden alleen in de stemmen van de vocalisten hoorbaar is, concentreren we ons hierop.')
    p
      make-links(text="Twee artiesten hebben Tijdloze nummers die in verschillende categoriën vallen. [Meat Loaf] zong zelf op [I'd Do Anything For Love (But I Won't Do That)] en zong in duet met Ellen Foley op [Paradise by the Dashboard Light]. De nummers van [Fleetwood Mac] vallen zelfs in drie categorieën: [Go Your Own Way] werd gezongen door een man (Lindsey Buckingham), [Dreams] en [Everywhere] werden gezongen door een vrouw (respectievelijk Stevie Nicks en Christine McVie) en op [The Chain] zingen deze drie zoveel samen, dat het nummer hier als duet geteld word.")
    p
      make-links(text="Naast Meat Loaf en Fleetwood Mac stond er ooit nog een ander duet in de Tijdloze: [Je T'Aime... Moi Non Plus] van [Serge Gainsbourg & Jane Birkin].")
  .scrollbox
    table.lijst
      tbody
        tr
          th.r Lead vocals
          th(v-for='year in years') {{year._yy}}
          th.r Tot.
        tr(v-for='{vocalsGenderId, total, perYear} in counts')
          td.r
            | {{vocalsGenders[vocalsGenderId]}}
          td(v-for='{count} in perYear')
            | {{count}}
          td.r
            | {{total}}
  .graph(v-for='{vocalsGenderId, dataPoints} in graphData')
    d3-distribution-graph(:points='dataPoints' :title='vocalsGenders[vocalsGenderId]')
</template>

<script>
  import vocalsGenders from '~/utils/leadVocals'
  import {useRootStore} from "~/stores/root";

  export default {
    computed: {
      years() {
        return useRootStore().years;
      },
      vocalsGenders() {
        return vocalsGenders;
      },
      graphData() {
        const dataPoints = {};
        const result = Object.keys(vocalsGenders).map(vocalsGenderId => {
          dataPoints[vocalsGenderId] = [];
          return {
            vocalsGenderId: vocalsGenderId,
            dataPoints: dataPoints[vocalsGenderId]
          };
        });

        useRootStore().songs.forEach(song => {
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
        return this.graphData.map(({vocalsGenderId, dataPoints}) => {
          return {
            vocalsGenderId: vocalsGenderId,
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
    }
  }
</script>
