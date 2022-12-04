<template lang="pug">
  div
    h2 Tijdloze landen
    .toelichting
      p
        tijdloze-links(text="Van welke nationaliteit zijn de artiesten wiens nummers in de Tijdloze top 100 staan? Meteen valt op dat het [*Verenigd Koninkrijk] en de [*Verenigde Staten] samen voor ca. 78% van alle nummers zorgen. In de beginjaren van de Tijdloze had het Verenigd Koninkrijk steeds veruit de meeste noteringen, maar sinds [2000] is de koppositie al een paar keer heen en weer gegaan tussen de twee landen.")
      p
        tijdloze-links(text="Eens kijken naar [*België] dan. Als je naar de cijfers kijkt, dan wordt duidelijk dat [dEUS] enorm veel betekend heeft voor de rockmuziek in België. Bij de eerste editie in [1987] werd België enkel vertegenwoordigd door [O La La La] van [T.C. Matic]. In [1994] bleef het aantal nummers van eigen bodem nog steeds steken op 4. En toen was er [dEUS]. Niet alleen kwamen de songs van de gODen massaal in de Tijdloze (6 nummers in ['99], ['02] en ['03]), maar opeens kregen de Tijdloze stemmers ook aandacht voor eigen bands als [K's Choice], [Zita Swoon], [Novastar], [De Mens] en [Hooverphonic]. En er is ook nog [Mia] van [Gorki] natuurlijk, dat van 2003 tot 2005 de eerste plaats haalde. Ook na het overlijden van Luc De Vos in 2014 stond Mia nog eens bovenaan de lijst.")
      p
        tijdloze-links(text="Andere landen met een aantal bands in de Tijdloze zijn [Ierland] ([U2], [Sinéad O'Connor], [The Cranberries]), [Canada] ([Bryan Adams], [Arcade Fire], [Leonard Cohen], [Alanis Morissette], [Steppenwolf], [Neil Young]), [Australië] ([AC/DC], [Nick Cave], [Crowded House]) en [Nederland] ([Golden Earring], [Krezip], [The Scene]). De kruimeltjes worden opgeraapt door [Jamaica] ([Bob Marley & the Wailers]), [Duitsland] ([Guano Apes], [Rammstein], [Scorpions]), [Frankrijk] ([Serge Gainsbourg & Jane Birkin] en [Laurent Garnier]) en [Zweden] ([Abba]).")
    .scrollbox
      table.lijst
        tbody
          tr
            th.r Land
            th(v-for='year in years') {{year._yy}}
            th.r Tot.
          tr(v-for='{countryId, total, perYear} in counts')
            td.r
              nuxt-link(:to='`/database?type=artiesten&land=${countryId}`')
                tijdloze-country-icon(:country-id='countryId' :include-name='true')
            td(v-for='{count} in perYear')
              | {{count}}
            td.r
              | {{total}}
    .graph(v-for='{countryId, dataPoints} in graphData')
      tijdloze-distribution-graph(:points='dataPoints')
        nuxt-link(:to='`/database?type=artiesten&land=${countryId}`')
          tijdloze-country-icon(:country-id='countryId' :include-name='true')
</template>

<script>
  import DistributionGraph from "../../components/d3/DistributionGraph"
  import _ from 'lodash';
  import countries from '~/utils/country'

  export default {
    components: {
      TijdlozeDistributionGraph: DistributionGraph
    },
    computed: {
      years() {
        return this.$store.getters.years;
      },
      countries() {
        return this.graphData.map(data => data.country);
      },
      graphData() {
        const usedCountryIds = _.sortBy(
            [...this.$store.getters.usedCountryIds],
            countryId => countries[countryId]
        )
        const dataPoints = {};

        const result = usedCountryIds.map(countryId => {
          dataPoints[countryId] = [];
          return {
            countryId: countryId,
            dataPoints: dataPoints[countryId]
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

        // Only return countries with at least on top 100 entry.
        return result.filter(data => data.dataPoints.length)
      },
      counts() {
        return this.graphData.map(({countryId, countryName, dataPoints}) => {
          return {
            countryId: countryId,
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
