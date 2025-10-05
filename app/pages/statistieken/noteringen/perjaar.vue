<template lang="pug">
div
  .toelichting
    p
      make-links(text="Deze tabel toont welke artisten in een bepaalde Tijdloze veel nummers hadden. Vier noteringen in een jaar komt wel vaker voor, maar slechts vier artiesten hadden ooit vijf nummers in eenzelfde Tijdloze lijst: [U2], [The Rolling Stones], [dEUS] en [Radiohead]. [U2] presteerde het in [1992] zelfs om zes nummers in de Tijdloze te hebben, een record dat in ['99], ['02] en ['03] evenaard werd door [dEUS]. Tot en met [2016] hadden [The Rolling Stones] minstens drie nummers in elke Tijdloze. Nu is er geen enkele artiest meer die dat nog kan zeggen.")

  table.lijst.perEen
    tbody
      tr
        th.r Jaar
        th
          table.valueSong
            tbody
              tr
                th Not.
                th.l Artiesten
      tr(v-for='{year, counts} in data')
        td.r
          year-link(:year='year')
        td
          table.valueSong
            tbody
              tr(v-for='{count, artists} in counts')
                td {{count}}
                td.l(v-if='artists')
                  span(v-for='(artist, index) in artists')
                    template(v-if='index > 0')
                      | ,
                      |
                    artist-link(:artist='artist')
                td.l(v-else) /
</template>

<script setup>
import { range } from 'ramda'

const props = defineProps({
  artists: Array,
  years: Array
})

const data = computed(() => {
  const MAX = 6;
  const MIN = 3;

  return [...props.years].reverse().map(year => {
    const artistsPerCount = Object.groupBy(props.artists, artist => {
      return artist.allSongs.filter(song => song.position(year)).length;
    });

    const counts = range(MIN, MAX + 1).reverse().map(count => {
      return {
        count: count,
        artists: artistsPerCount[count]
      }
    });


    return {
      year: year,
      counts: counts
    };
  });
})

useHead({
  title: 'Noteringen per jaar'
})
</script>
