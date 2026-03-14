<template lang="pug">
Title Talen
div
  h2 Tijdloze talen
  .toelichting
    p
      make-links(text='Bijna alle nummers in de Tijdloze zijn (hoofdzakelijk) in het Engels gezongen, in de eerste twee edities stonden er zelfs alleen maar Engelstalige nummers in de lijst.')
    p
      make-links(text="In de jaren '90 kwamen er ook enkele Nederlandstalige nummers de Tijdloze binnengeslopen: [Irene], [Blauw], [Meisjes], [Lieve Kleine Piranha] en natuurlijk [Mia], dat in [2003] zelfs tot op de eerste plaats klom. Na het verdwijnen van de andere nummers is Mia sinds [2009] het enige overblijvende Nederlandstalige nummer in de Tijdloze.")
    p
      make-links(text="Het Franstalige [Je T'Aime... Moi Non Plus] een maal in de lijst, in [1991].")
    p
      make-links(text='[Samba Pa Ti] van gitarist [Santana] heeft twee noteringen, en was tot in [2006] het enige instrumentale nummer dat ooit in de Tijdloze stond. Sindsdien zijn er echter nog drie nummers bijgekomen in deze categorie: [Housewife] van [Daan], [The Man with the Red Face] van [Laurent Garnier] en [Universal Nation] van [Push].')

  ui-data-table(:data="counts" property-name="Taal")

  .graph(v-for='{languageId, dataPoints} in graphData')
    d3-distribution-graph(:points='dataPoints' :title='languages[languageId]')
</template>

<script setup lang="ts">
import languages from '~/utils/language'
import type { DataPoint } from './dataPoint'

const {songs} = storeToRefs(useRootStore())
const {years} = storeToRefs(useYearStore())

const graphData = computed(() => {
  const dataPoints: Record<string, DataPoint[]> = {};
  const allYears = years.value
  const result = Object.keys(languages).map((languageId: string) => {
    dataPoints[languageId] = [];
    return {
      languageId: languageId,
      dataPoints: dataPoints[languageId]
    };
  });

  songs.value.forEach(song => {
    const languageId = song.languageId
    if (languageId) {
      allYears.forEach(year => {
        if (song.position(year)) {
          if (!dataPoints[languageId]) {
            dataPoints[languageId] = []
          }
          dataPoints[languageId].push({
            song: song,
            year: year
          });
        }
      });
    }
  });

  // Only return languages with at least on top 100 entry.
  return result.filter(data => data.dataPoints.length)
})
const counts = computed(() => {
  const allYears = years.value
  return graphData.value.map(({languageId, dataPoints}) => {
    return {
      entry: languages[languageId] ?? languageId,
      total: dataPoints.length,
      perYear: Object.fromEntries(
        allYears.map(year => [
          year.yyyy,
          dataPoints.filter(dataPoint => dataPoint.year.equals(year)).length
        ])
      )
    }
  });
})
</script>
