<template lang="pug">
Title Decennia
div
  h2 Tijdloze decennia
  .toelichting
    p
      make-links(text='Er stond slechts éénmaal een nummer uit de <strong>Fifties</strong> in de Tijdloze: [Jailhouse Rock] van [Elvis Presley], op positie 63 in [1987].')
    p
      make-links(text="De gouden <strong>[Sixties]</strong> vulden lange tijd ongeveer 20% van de Tijdloze. Rond de eeuwwisseling daalde dit aantal echter dramatisch, met maar liefst zes exits in [2001] alleen. Op het dieptepunt ('04-'06) stonden er nog maar vijf nummers uit de Sixties in de Tijdloze. De laatste jaren is er echter een kleine revival, en is het aantal Sixties-songs weer langzaam aan het stijgen.")
    p
      make-links(text='De <strong>[Seventies]</strong> en <strong>Eighties</strong> zorgden in de beginjaren van de Tijdloze voor de grote meerderheid van de nummers. Logisch eigenlijk, want de [Nineties] waren nog maar nauwelijks of niet begonnen.')
    p
      make-links(text="[The Ship Song] van [Nick Cave] was in [1990] het eerste nummer uit de <strong>Nineties</strong> dat in de Tijdloze stond. De muziek uit dit decennium kreeg echter buitengewoon snel de status van 'tijdloos'. In de eerste jaren van de 21ste eeuw bestond de helft van de lijst uit nummers uit de Nineties. Geen enkel ander decennium had ooit zo'n overwicht.")
    p
      make-links(text='[They Stood Up For Love] van [Live] en [I Would Stay] van [Krezip] waren in [2000] de eerste nummers uit de <strong>Noughties</strong> in de Tijdloze. Ironisch genoeg zijn beide nummers ondertussen reeds verdwenen uit de lijst. Andere liedjes zijn in de plaats gekomen, maar in mindere mate dan dit met nummers uit de Nineties is gebeurd.')
    p
      make-links(text='De <strong>Twenty-tens</strong> kwamen voor het eerst in [2011] in de Tijdloze met [No Sound But the Wind] van de [Editors].')
  ui-data-table(:data="counts" property-name="Decennium")
  template(v-for='{decade, dataPoints} in graphData' :key="decade.name")
    .graph(v-if="dataPoints.length")
      d3-distribution-graph(:title='decade.name' :points='dataPoints')
</template>

<script setup>
import Album from "@/orm/Album";
import {useRepo} from "pinia-orm";

const {songs} = storeToRefs(useRootStore())
const {currentYear, years} = storeToRefs(useYearStore())

const decades = computed(() => {
  const startYear = Math.min(...useRepo(Album).all().map(album => album.releaseYear));
  const endYear = currentYear.value.yyyy;
  const decades = [];
  for (let decadeYear = yearInDecade(startYear); decadeYear <= endYear; decadeYear += 10) {
    decades.push({ decadeYear, name: `De jaren '${decadeYear.toString().substring(2,4)}` })
  }
  return decades.reverse();
})
const graphData = computed(() => {
  const dataPoints = {};
  const result = decades.value.map(decade => {
    dataPoints[decade.decadeYear] = [];
    return {
      decade: decade,
      dataPoints: dataPoints[decade.decadeYear]
    };
  });

  songs.value.forEach(song => {
    years.value.forEach(year => {
      if (song.position(year)) {
        dataPoints[yearInDecade(song.album.releaseYear)].push({
          song: song,
          year: year
        });
      }
    });
  });

  return result;
})
const counts = computed(() => {
  const allCounts = graphData.value.map(({decade, dataPoints}) => {
    return {
      entry: decade.name,
      total: dataPoints.length,
      perYear: Object.fromEntries(
        years.value.map(year => [
          year.yyyy,
          dataPoints.filter(dataPoint => dataPoint.year.equals(year)).length
        ])
      )
    }
  });
  return allCounts.filter(entry => entry.total > 0)
})

function yearInDecade(yyyy) {
  return yyyy - yyyy % 10;
}
</script>
