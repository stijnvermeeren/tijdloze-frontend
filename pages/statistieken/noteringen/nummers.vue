<template>
    <div>
        <div class="toelichting">
            <p><tijdloze-links text="Hoeveel verschillende nummers van eenzelfde artiest stonden ooit in een top 100 van de Tijdloze (niet noodzakelijk in hetzelfde jaar)?" /></p>
        </div>

        <table class="lijst perVijf">
            <tbody>
                <tr>
                    <th class="r"></th>
                    <th class="l"><nuxt-link to="/artiesten">Artiest</nuxt-link></th>
                    <th>Aantal nummers</th>
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
            count: artist.songs.filter(song => {
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
