<template lang="pug">
div
  .toelichting
    p
      tijdloze-links(text='Deze lijst toont het aantal keer dat een nummer vanop een bepaald album in een Tijdloze top 100 stond.')
  table.lijst.perVijf
    tbody
      tr
        th.r
        th.l Album
        th Noteringen
      tr(v-for='{position, entry} in ranking')
        td.r {{position}}
        td.l
          tijdloze-album(:album='entry.album')
          |
          | (
          tijdloze-artist(:artist='entry.album.artist')
          | )
        td {{entry.count}}
</template>

<script>
  import ranking from '~/utils/ranking';
  import _ from 'lodash'

  export default {
    props: {
      albums: Array,
      years: Array
    },
    computed: {
      ranking() {
        const data = this.albums.map(album => {
          return {
            album: album,
            count: _.sum(album.songs.map(song => song.listCount(this.years)))
          };
        }).filter(({ count }) => count > 0);
        return ranking(
          data,
          ({count}) => -count,
          ({album}) => album.title,
          200
        );
      }
    }
  }
</script>
