<template lang="pug">
  div
    .toelichting
      p
        tijdloze-links(text='Hoeveel verschillende nummers van eenzelfde artiest stonden ooit in een top 100 van de Tijdloze (niet noodzakelijk in hetzelfde jaar)?')
    table.lijst.perVijf
      tbody
        tr
          th.r
          th.l
            nuxt-link(to='/artiesten') Artiest
          th Aantal nummers
        tr(v-for='{position, entry} in ranking')
          td.r {{position}}
          td.l
            tijdloze-artist(:artist='entry.artist')
          td {{entry.count}}
</template>

<script>
  import ranking from '../../../store/ranking';
  import _ from 'lodash'

  export default {
    props: ['artists', 'years'],
    computed: {
      ranking() {
        const data = this.artists.map(artist => {
          return {
            artist: artist,
            count: artist.allSongs.filter(song => {
              return _.find(this.years, year => song.position(year))
            }).length
          };
        }).filter(({ count }) => count > 1);

        return ranking(
          data,
          ({count}) => -count,
          ({artist}) => artist.name,
          50
        );
      }
    },
    head: {
      title: 'Noteringen: verschillende nummers'
    }
  }
</script>
