<template lang="pug">
  div
    h2 Tijdloze landen
    .toelichting
      p
        tijdloze-links(text="Van welke nationaliteit zijn de artiesten wiens nummers in de Tijdloze staan? Meteen valt op dat het [*Verenigd Koninkrijk] en de [*USA] voor maar liefst 77% van alle nummers zorgen. De verdeling tussen de twee landen is echter doorheen de jaren wel omgedraaid. Tot ['99] had het Verenigd Koninkrijk consequent de meeste noteringen, maar sinds [2000] vinden we de nummers uit de Verenigde Staten Tijdlozer.")
      p
        tijdloze-links(text="Eens kijken naar [*België] dan. Als je naar de cijfers kijkt, dan wordt duidelijk dat [dEUS] enorm veel betekend heeft voor de rockmuziek in België. Bij de eerste editie in [1987] werd België enkel vertegenwoordigd door [O La La La] van [T.C. Matic]. In [1994] bleef het aantal nummers van eigen bodem nog steeds steken op 4. En toen was er [dEUS]. Niet alleen kwamen de songs van de gODen massaal in de Tijdloze (6 nummers in ['99], ['02] en ['03]), maar opeens kregen de Tijdloze stemmers ook aandacht voor eigen bands als [K's Choice], [Zita Swoon], [Novastar], [De Mens] en [Hooverphonic]. En er is ook nog [Mia] natuurlijk...")
      p
        tijdloze-links(text="Andere landen met een aantal bands in de Tijdloze zijn [Ierland] ([U2], [Sinéad O'Connor], [Cranberries], [Therapy?]), [Canada] ([Bryan Adams], [Arcade Fire], [Alanis Morissette], [Steppenwolf], [Neil Young]), [Australië] ([AC/DC], [Nick Cave], [Crowded House]) en [Nederland] ([Golden Earring], [Krezip], [The Scene]). De kruimeltjes worden opgeraapt door [Jamaica] ([Bob Marley]), [Duitsland] ([Guano Apes], [Scorpions]), [Frankrijk] ([Serge Gainsbourg & Jane Birkin] en [Laurent Garnier]) en [Zweden] ([Abba]).")
    .scrollbox
      table.lijst
        tbody
          tr
            th.r Land
            th(v-for='year in years') {{year._yy}}
            th.r Tot.
          tr(v-for='{country, total, perYear} in counts')
            td.r
              tijdloze-country-icon(:country='country' :include-name='true')
            td(v-for='{count} in perYear')
              | {{count}}
            td.r
              | {{total}}
    .graph(v-for='{country, dataPoints} in graphData')
      tijdloze-distribution-graph(:points='dataPoints')
        tijdloze-country-icon(:country='country' :include-name='true')
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
      countries() {
        return _.sortBy(
          this.$store.state.countries,
          country => country.name
        );
      },
      graphData() {
        const dataPoints = {};
        const result = this.countries.map(country => {
          dataPoints[country.id] = [];
          return {
            country: country,
            dataPoints: dataPoints[country.id]
          };
        });

        this.$store.getters.songs.forEach(song => {
          if (song.artist.countryId) {
            this.years.forEach(year => {
              if (song.position(year)) {
                dataPoints[song.artist.countryId].push({
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
        return this.graphData.map(({country, dataPoints}) => {
          return {
            country: country,
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
      title: 'Landen'
    }
  }
</script>
