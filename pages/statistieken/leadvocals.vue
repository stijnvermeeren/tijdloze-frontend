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
  ui-data-table(:data="counts" property-name="Lead vocals")
  .graph(v-for='{vocalsGenderId, dataPoints} in graphData')
    d3-distribution-graph(:points='dataPoints' :title='vocalsGenders[vocalsGenderId]')
</template>

<script setup>
import vocalsGenders from '~/utils/leadVocals'
import {useRootStore} from "~/stores/root";

const {songs, years} = storeToRefs(useRootStore())

const graphData = computed(() => {
  const dataPoints = {};
  const result = Object.keys(vocalsGenders).map(vocalsGenderId => {
    dataPoints[vocalsGenderId] = [];
    return {
      vocalsGenderId: vocalsGenderId,
      dataPoints: dataPoints[vocalsGenderId]
    };
  });

  songs.value.forEach(song => {
    if (song.leadVocals) {
      years.value.forEach(year => {
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
})
const counts = computed(() => {
  return graphData.value.map(({vocalsGenderId, dataPoints}) => {
    return {
      entry: vocalsGenders[vocalsGenderId],
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
