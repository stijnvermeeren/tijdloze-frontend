<template lang="pug">
div
  .toelichting
    p
      make-links(text='Hoeveel verschillende nummers vanop eenzelfde album stonden ooit in een top 100 van de Tijdloze (niet noodzakelijk in hetzelfde jaar)?')
  table.lijst.perVijf
    tbody
      tr
        th.r
        th.l Album
        th Aantal nummers
      tr(v-for='{position, entry} in rankingList')
        td.r {{position}}
        td.l
          | #[album-link(:album='entry.album')] (#[artist-link(:artist='entry.album.artist')])
        td {{entry.count}}
</template>

<script setup>
import ranking from '~/utils/ranking';
import _ from 'lodash'

const props = defineProps({
  albums: Array,
  years: Array
})

const rankingList = computed(() => {
  const data = props.albums.map(album => {
    return {
      album: album,
      count: album.songs.filter(song => {
        return _.find(props.years, year => song.position(year))
      }).length
    };
  }).filter(({ count }) => count > 1);

  return ranking(
    data,
    ({count}) => -count,
    ({album}) => album.title,
    50
  );
})

useHead({
  title: 'Noteringen (albums): verschillende nummers'
})
</script>
