<template lang="pug">
div
  .toelichting
    p
      make-links(text='Deze lijst toont het aantal keer dat een nummer vanop een bepaald album in een Tijdloze top 100 stond.')
  table.lijst.perVijf
    tbody
      tr
        th.r
        th.l Album
        th Noteringen
      tr(v-for='{position, entry} in rankingList')
        td.r {{position}}
        td.l
          album-link(:album='entry.album')
          |
          | (
          artist-link(:artist='entry.album.artist')
          | )
        td {{entry.count}}
</template>

<script setup>
import ranking from '~/utils/ranking';

const props = defineProps({
  albums: Array,
  years: Array
})

const rankingList = computed(() => {
  const data = props.albums.map(album => {
    return {
      album: album,
      count: album.songs.map(song => song.listCount(props.years)).reduce((a, b) => a + b, 0)
    };
  }).filter(({ count }) => count > 0);
  return ranking(
    data,
    ({count}) => -count,
    ({album}) => album.title,
    200
  );
})
</script>
