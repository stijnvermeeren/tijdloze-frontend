<template>
  <div>
    <ul class="info">
      <li><strong>Taal:</strong> {{ language.name }}</li>
      <li><strong>Origineel op album: </strong> <TijdlozeAlbum :album="song.album" /> ({{ song.album.releaseYear }})</li>
      <li v-if="links.length">
        <strong>Links: </strong>
        <span
          v-for="(link, index) in links"
          :key="index"
        >
          <span v-if="index > 0">
            ,
          </span>
          <a :href="link.href">
            {{ link.title }}
          </a>
        </span>
      </li>
      <li v-if="fullSongData.notes">
        <em>{{ fullSongData.notes }}</em>
      </li>
    </ul>

    <TijdlozeSongsOverviewAndGraph :songs="[song]" />

    <div class="allPositions">
      <table>
        <tbody>
          <tr>
            <th>Jaar</th>
            <th>Positie</th>
          </tr>
          <tr
            v-for="year in years"
            :key="year.yyyy"
          >
            <th><TijdlozeYear :year="year" /></th>
            <td>
              <TijdlozePositionChange
                :song="song"
                :year="year"
              /> <TijdlozePosition
                :song="song"
                :year="year"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import ColorLabel from "../../../components/d3/ColorLabel";
  import SongsOverviewAndGraph from "../../../components/SongsOverviewAndGraph";
  import _ from 'lodash';

  export default {
    components: {
      TijdlozeSongsOverviewAndGraph: SongsOverviewAndGraph
    },
    props: ['song', 'fullSongData'],
    computed: {
      language() {
        return this.$store.getters.languagesById[this.fullSongData.languageId];
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
