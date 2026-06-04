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

<script setup lang="ts">
import ranking from '~/utils/ranking';
import type Album from '~/orm/Album'
import type Year from '~/orm/Year'

const props = defineProps<{ albums: Album[]; years: Year[] }>()

const rankingList = computed(() => {
  const data = props.albums.map((album: Album) => {
    return {
      album: album,
      count: album.songs.filter(song => {
        return props.years.find((year: Year) => song.position(year))
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
