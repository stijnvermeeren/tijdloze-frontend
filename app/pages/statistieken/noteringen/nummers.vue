<template lang="pug">
div
  .toelichting
    p
      make-links(text='Hoeveel verschillende nummers van eenzelfde artiest stonden ooit in een top 100 van de Tijdloze (niet noodzakelijk in hetzelfde jaar)?')
  table.lijst.perVijf
    tbody
      tr
        th.r
        th.l Artiest
        th Aantal nummers
      tr(v-for='{position, entry} in rankingList')
        td.r {{position}}
        td.l
          artist-link(:artist='entry.artist')
        td {{entry.count}}
</template>

<script setup lang="ts">
import ranking from '~/utils/ranking';
import type Artist from '~/orm/Artist'
import type Year from '~/orm/Year'

const props = defineProps<{ artists: Artist[]; years: Year[] }>()

const rankingList = computed(() => {
  const data = props.artists.map((artist: Artist) => {
    return {
      artist: artist,
      count: artist.allSongs.filter(song => {
        return props.years.find((year: Year) => song.position(year))
      }).length
    };
  }).filter(({ count }) => count > 1);

  return ranking(
    data,
    ({count}) => -count,
    ({artist}) => artist.name,
    50
  );
})

useHead({
  title: 'Noteringen: verschillende nummers'
})
</script>
