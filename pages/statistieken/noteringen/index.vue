<template>
    <div>
        <div class="toelichting">
            <p><tijdloze-links text="Deze tabel toont het aantal keer dat een nummer van een bepaalde artiest in een top 100 van de Tijdloze stond. Deze lijst heeft een opvallend ander uitzicht dan de meeste Tijdloze ranglijsten. Het is hier ver zoeken naar [Deep Purple], [Gorky], [Nirvana], [The Cure] of [Queen]. Aan de top in deze lijst vinden we immers de bands met veel nummers in de Tijdloze, niet noodzakelijk de echte toppers. Koploper hier is [U2]. [dEUS], [The Rolling Stones], [Radiohead] en [The Doors] vervolledigen de opmerkelijke top vijf. Nog opvallend: [The Beatles] staan nog steeds relatief hoog, hoewel er van [2002] tot en met [2008] geen enkel nummer van hen in de Tijdloze stond!" /></p>
        </div>

        <table class="lijst perVijf">
            <tbody>
                <tr>
                    <th class="r"></th>
                    <th class="l"><nuxt-link to="/artiesten">Artiest</nuxt-link></th>
                    <th>Noteringen</th>
                </tr>
                <tr v-for="{position, entry} in ranking">
                    <td class="r">{{position}}</td>
                    <td class="l"><tijdloze-artist :artist="entry.artist" /></td>
                    <td>{{entry.count}}</td>
                </tr>
            </tbody>
        </table>
    </div>
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
            count: _.sum(artist.songs.map(song => song.listCount(this.years)))
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
