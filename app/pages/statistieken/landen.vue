<template lang="pug">
Title Landen
div
  h2 Tijdloze landen
  .toelichting
    p
      make-links(text="Van welke nationaliteit zijn de artiesten wiens nummers in de Tijdloze top 100 staan? Meteen valt op dat het [*Verenigd Koninkrijk] en de [*Verenigde Staten] samen voor ca. 78% van alle nummers zorgen. In de beginjaren van de Tijdloze had het Verenigd Koninkrijk steeds veruit de meeste noteringen, maar sinds [2000] is de koppositie al een paar keer heen en weer gegaan tussen de twee landen.")
    p
      make-links(text="Eens kijken naar [*België] dan. Als je naar de cijfers kijkt, dan wordt duidelijk dat [dEUS] enorm veel betekend heeft voor de rockmuziek in België. Bij de eerste editie in [1987] werd België enkel vertegenwoordigd door [O La La La] van [T.C. Matic]. In [1994] bleef het aantal nummers van eigen bodem nog steeds steken op 4. En toen was er [dEUS]. Niet alleen kwamen de songs van de gODen massaal in de Tijdloze (6 nummers in ['99], ['02] en ['03]), maar opeens kregen de Tijdloze stemmers ook aandacht voor eigen bands als [K's Choice], [Zita Swoon], [Novastar], [De Mens] en [Hooverphonic]. En er is ook nog [Mia] van [Gorki] natuurlijk, dat van 2003 tot 2005 de eerste plaats haalde. Ook na het overlijden van Luc De Vos in 2014 stond Mia nog eens bovenaan de lijst.")
    p
      make-links(text="Andere landen met een aantal bands in de Tijdloze zijn [Ierland] ([U2], [Sinéad O'Connor], [The Cranberries]), [Canada] ([Bryan Adams], [Arcade Fire], [Leonard Cohen], [Alanis Morissette], [Steppenwolf], [Neil Young]), [Australië] ([AC/DC], [Nick Cave], [Crowded House]) en [Nederland] ([Golden Earring], [Krezip], [The Scene]). De kruimeltjes worden opgeraapt door [Jamaica] ([Bob Marley & the Wailers]), [Duitsland] ([Guano Apes], [Rammstein], [Scorpions]), [Frankrijk] ([Serge Gainsbourg & Jane Birkin] en [Laurent Garnier]) en [Zweden] ([Abba]).")
  ui-data-table(:data="counts" property-name="Land")
    template(v-slot:itemName="{value}")
      nuxt-link(:to='`/database?type=artiesten&land=${value}`')
        country-icon(:country-id='value' :include-name='true')

  .graph(v-for='{countryId, dataPoints} in graphData')
    d3-distribution-graph(:points='dataPoints')
      nuxt-link(:to='`/database?type=artiesten&land=${countryId}`')
        country-icon(:country-id='countryId' :include-name='true')
</template>

<script setup>
import countries from '~/utils/country'
import sortBy from 'ramda/src/sortBy'

const {usedCountryIds, songs} = storeToRefs(useRootStore())
const {years} = storeToRefs(useYearStore())

const graphData = computed(() => {
  const sortedUsedCountryIds = sortBy(countryId => countries[countryId])(
    [...usedCountryIds.value]  // convert set to sortable array
  )
  const dataPoints = {};

  const result = sortedUsedCountryIds.map(countryId => {
    dataPoints[countryId] = [];
    return {
      countryId: countryId,
      dataPoints: dataPoints[countryId]
    };
  });

  songs.value.forEach(song => {
    if (song.artist.countryId) {
      years.value.forEach(year => {
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
})

const counts = computed(() => {
  return graphData.value.map(({countryId, countryName, dataPoints}) => {
    return {
      entry: countryId,
      total: dataPoints.length,
      perYear: Object.fromEntries(
        years.value.map(year => [
          year.yyyy,
          dataPoints.filter(dataPoint => dataPoint.year.equals(year)).length
        ])
      )
    }
  });
})
</script>
