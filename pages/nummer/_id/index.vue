<template>
    <div>
        <h2><tijdloze-h2-icon name="song" alt="Nummer" />{{song.title}} (<tijdloze-artist :artist="artist" />)</h2>

        <tijdloze-tabs :tabs="[{ title: 'Informatie' }, { to: `/nummer/${song.id}/lyrics`, title: 'Songtekst' }]">
            <ul class="info">
                <li><strong>Taal:</strong> {{language.name}}</li>
                <li><strong>Origineel op album: </strong> <tijdloze-album :album="album" /> ({{album.releaseYear}})</li>
                <li v-if="links.length"><strong>Links: </strong>
                    <span v-for="(link, index) in links">
                        <span v-if="index > 0">, </span>
                        <a :href="link.href">{{link.title}}</a>
                    </span>
                </li>
                <li v-if="fullSongData.notes"><em>{{fullSongData.notes}}</em></li>
            </ul>

            <tijdloze-songs-overview-and-graph :songs="[song]"/>

            <div class="allPositions">
                <table>
                    <tr>
                        <th>Jaar</th>
                        <th>Positie</th>
                    </tr>
                    <tr v-for="year in years">
                        <th><tijdloze-year :year="year" /></th>
                        <td>
                            <tijdloze-position-change :song="song" :year="year" /> <tijdloze-position :song="song" :year="year" />
                        </td>
                    </tr>
                </table>
            </div>
        </tijdloze-tabs>
    </div>
</template>

<script>
  import ColorLabel from "../../../components/d3/ColorLabel";
  import SongsOverviewAndGraph from "../../../components/SongsOverviewAndGraph";
  import H2Icon from "../../../components/H2Icon";
  import _ from 'lodash';

  export default {
    components: {
      TijdlozeSongsOverviewAndGraph: SongsOverviewAndGraph,
      TijdlozeH2Icon: H2Icon
    },
    computed: {
      artist() {
        return this.$store.getters.artistsById[this.song.artistId];
      },
      album() {
        return this.$store.getters.albumsById[this.song.albumId];
      },
      language() {
        return this.$store.getters.languagesById[this.fullSongData.languageId];
      },
      song() {
        return this.$store.getters.songsById[this.fullSongData.id];
      },
      years() {
        return this.$store.getters.years;
      },
      links() {
        const links = [];
        const addLink = (property, title) => {
          if (this.fullSongData[property]) {
            links.push({
              href: this.fullSongData[property],
              title: title
            })
          }
        };

        addLink('urlWikiEn', 'Wikipedia (Engels)');
        addLink('urlWikiNl', 'Wikipedia (Nederlands)');
        return links;
      }
    },
    async asyncData({ params, app }) {
      return {
        fullSongData: await app.$axios.$get(`song/${params.id}`)
      };
    },
    head() {
      return {
        title: `${this.song.title} (${this.artist.fullName})`
      }
    }
  }
</script>

<style lang="less" scoped>
    div.allPositions {
        margin: 1em 3em;
        text-align: center;
        table {
            line-height: 3.2em;
            tr {
                line-height: 1em;
                width: 4.8em;
                display: inline-block;
            }
            td, th {
                display: block;
                text-align: center;
                width: auto;
            }
        }
    }
</style>
