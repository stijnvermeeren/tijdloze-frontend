<template lang="pug">
  div
    .toelichting
      p
        tijdloze-links(text='Deze tabel toont het aantal keer dat een nummer van een bepaalde artiest in een top 100 van de Tijdloze stond. Deze lijst heeft een opvallend ander uitzicht dan de meeste Tijdloze ranglijsten. Het is hier ver zoeken naar [Deep Purple], [Gorky], [Nirvana], [The Cure] of [Queen]. Aan de top in deze lijst vinden we immers de bands met veel nummers in de Tijdloze, niet noodzakelijk de echte toppers. Koploper hier is [U2]. [dEUS], [The Rolling Stones], [Radiohead] en [The Doors] vervolledigen de opmerkelijke top vijf. Nog opvallend: [The Beatles] staan nog steeds relatief hoog, hoewel er van [2002] tot en met [2008] geen enkel nummer van hen in de Tijdloze stond!')

    table.lijst.perVijf
      tbody
        tr
          th.r
          th.l Artiest
          th Noteringen
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
    props: {
      artists: Array,
      years: Array
    },
    computed: {
      ranking() {
        const data = this.artists.map(artist => {
          return {
            artist: artist,
            count: _.sum(artist.allSongs.map(song => song.listCount(this.years)))
          };
        }).filter(({ count }) => count > 0);
        return ranking(
          data,
          ({count}) => -count,
          ({artist}) => artist.name,
          200
        );
      }
    }
  }
</script>
