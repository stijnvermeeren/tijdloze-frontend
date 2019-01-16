<template lang="pug">
  div
    h2 Tijdloze decennia
    .toelichting
      p
        tijdloze-links(text='Er stond slechts éénmaal een nummer uit de <strong>Fifties</strong> in de Tijdloze: [Jailhouse Rock] van [Elvis Presley], op positie 63 in [1987].')
      p
        tijdloze-links(text="De gouden <strong>[Sixties]</strong> vulden lange tijd ongeveer 20% van de Tijdloze. Rond de eeuwwisseling daalde dit aantal echter dramatisch, met maar liefst zes exits in [2001] alleen. Op het dieptepunt ('04-'06) stonden er nog maar vijf nummers uit de Sixties in de Tijdloze. De laatste jaren is er echter een kleine revival, en is het aantal Sixties-songs weer langzaam aan het stijgen.")
      p
        tijdloze-links(text='De <strong>[Seventies]</strong> en <strong>Eighties</strong> zorgden in de beginjaren van de Tijdloze voor de grote meerderheid van de nummers. Logisch eigenlijk, want de [Nineties] waren nog maar nauwelijks of niet begonnen.')
      p
        tijdloze-links(text="[The Ship Song] van [Nick Cave] was in [1990] het eerste nummer uit de <strong>Nineties</strong> dat in de Tijdloze stond. De muziek uit dit decennium kreeg echter buitengewoon snel de status van 'tijdloos'. In de eerste jaren van de 21ste eeuw bestond de helft van de lijst uit nummers uit de Nineties. Geen enkel ander decennium had ooit zo'n overwicht.")
      p
        tijdloze-links(text='[They Stood Up For Love] van [Live] en [I Would Stay] van [Krezip] waren in [2000] de eerste nummers uit de <strong>Noughties</strong> in de Tijdloze. Ironisch genoeg zijn beide nummers ondertussen reeds verdwenen uit de lijst. Andere liedjes zijn in de plaats gekomen, maar in mindere mate dan dit met nummers uit de Nineties is gebeurd.')
      p
        tijdloze-links(text='De <strong>Twenty-tens</strong> kwamen voor het eerst in [2011] in de Tijdloze met [No Sound But the Wind] van de [Editors].')
    .scrollbox
      table.lijst
        tbody
          tr
            th.r Decennium
            th(v-for='year in years') {{year._yy}}
            th.r Tot.
          tr(v-for='{decade, total, perYear} in counts')
            td.r
              | {{decade.name}}
            td(v-for='{count} in perYear')
              | {{count}}
            td.r
              | {{total}}
    .graph(v-for='{decade, dataPoints} in graphData')
      tijdloze-distribution-graph(:title='decade.name' :points='dataPoints')
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
      currentYear() {
        return this.$store.getters.currentYear;
      },
      decades() {
        const startYear = this.$store.getters['entities/albums/query']().min('releaseYear');
        const endYear = this.currentYear.yyyy;
        const decades = [];
        for (let decadeYear = this.decadeYear(startYear); decadeYear <= endYear; decadeYear += 10) {
          decades.push({ decadeYear, name: `De jaren '${decadeYear.toString().substring(2,4)}` })
        }
        return decades.reverse();
      },
      graphData() {
        const dataPoints = {};
        const result = this.decades.map(decade => {
          dataPoints[decade.decadeYear] = [];
          return {
            decade: decade,
            dataPoints: dataPoints[decade.decadeYear]
          };
        });

        this.$store.getters.songs.forEach(song => {
          this.years.forEach(year => {
            if (song.position(year)) {
              dataPoints[this.decadeYear(song.album.releaseYear)].push({
                song: song,
                year: year
              });
            }
          });
        });

        return result;
      },
      counts() {
        return this.graphData.map(({decade, dataPoints}) => {
          return {
            decade: decade,
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
      title: 'Decennia'
    }
  }
</script>
