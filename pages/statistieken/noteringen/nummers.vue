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

<script setup>
import ranking from '~/utils/ranking';
import _ from 'lodash'

const props = defineProps({
  artists: Array,
  years: Array
})

const rankingList = computed(() => {
  const data = props.artists.map(artist => {
    return {
      artist: artist,
      count: artist.allSongs.filter(song => {
        return _.find(props.years, year => song.position(year))
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
