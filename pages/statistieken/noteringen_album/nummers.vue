<template lang="pug">
  div
    .toelichting
      p
        tijdloze-links(text='Hoeveel verschillende nummers vanop eenzelfde album stonden ooit in een top 100 van de Tijdloze (niet noodzakelijk in hetzelfde jaar)?')
    table.lijst.perVijf
      tbody
        tr
          th.r
          th.l Album
          th Aantal nummers
        tr(v-for='{position, entry} in ranking')
          td.r {{position}}
          td.l
            | #[tijdloze-album(:album='entry.album')] (#[tijdloze-artist(:artist='entry.album.artist')])
          td {{entry.count}}
</template>

<script>
  import ranking from '../../../store/ranking';
  import _ from 'lodash'

  export default {
    props: ['albums', 'years'],
    computed: {
      ranking() {
        const data = this.albums.map(album => {
          return {
            album: album,
            count: album.songs.filter(song => {
              return _.find(this.years, year => song.position(year))
            }).length
          };
        }).filter(({ count }) => count > 1);

        return ranking(
          data,
          ({count}) => -count,
          ({album}) => album.title,
          50
        );
      }
    },
    head: {
      title: 'Noteringen (albums): verschillende nummers'
    }
  }
</script>
