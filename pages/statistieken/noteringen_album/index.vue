<template>
    <div>
        <div class="toelichting">
            <p><tijdloze-links text="Deze lijst toont het aantal keer dat een nummer vanop een bepaald album in een Tijdloze top 100 stond.

" /></p>
        </div>

        <table class="lijst perVijf">
            <tbody>
                <tr>
                    <th class="r"></th>
                    <th class="l">Album</th>
                    <th>Noteringen</th>
                </tr>
                <tr v-for="{position, entry} in ranking">
                    <td class="r">{{position}}</td>
                    <td class="l"><tijdloze-album :album="entry.album" /> (<tijdloze-artist :artist="entry.album.artist" />)</td>
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
    props: ['albums', 'years'],
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
