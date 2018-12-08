<template>
    <div class="container">
        <page-title icon="song" icon-alt="Nummer">
            <h2>{{song.title}}</h2>
        </page-title>

        <table class="info">
            <tbody>
                <tr class="important">
                    <th>Nummer van</th>
                    <td><tijdloze-artist :artist="song.artist" /></td>
                </tr>
                <tr>
                    <th>Origineel op album</th>
                    <td><TijdlozeAlbum :album="song.album" /> ({{ song.album.releaseYear }})</td>
                </tr>
                <tr>
                    <th>In de Tijdloze</th>
                    <td>
                        <in-current-list-song :song="song" />
                    </td>
                </tr>
                <tr v-if="fullSongData.spotifyId" class="spotify">
                    <th>Beluister fragment</th>
                    <td>
                        <spotify :spotifyId="fullSongData.spotifyId" />
                    </td>
                </tr>
                <tr class="unimportant">
                    <th>Taal</th>
                    <td>{{ language.name }}</td>
                </tr>
                <tr class="unimportant">
                    <th>Externe links</th>
                    <td>
                        <div v-for="(link, index) in links" :key="index">
                            <a :href="link.href">{{ link.title }}</a>
                        </div>
                    </td>
                </tr>
                <tr v-if="fullSongData.notes" class="unimportant">
                    <td colspan="2"><make-links :text="fullSongData.notes" /></td>
                </tr>
            </tbody>
        </table>

        <lyrics>
            <div class="lyrics">{{ fullSongData.lyrics }}</div>
        </lyrics>

        <h3>In de Tijdloze</h3>

        <div><entry-count :songs="[song]" /></div>

        <tijdloze-graph
          v-if="song.listCount($store.getters.years) > 0"
          :songs="[song]"
        />

        <div class="allPositions">
            <table>
                <tbody>
                    <tr>
                        <th>Jaar</th>
                        <th>Positie</th>
                    </tr>
                    <template v-for="(interval, index) in intervals">
                        <tr v-if="index">
                            <td>...</td>
                            <td></td>
                        </tr>
                        <tr
                          v-for="year in interval"
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
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
  import Lyrics from "~/components/Lyrics";
  import Graph from '~/components/d3/Graph'
  import PageTitle from '../../components/PageTitle'
  import EntryCount from '../../components/EntryCount'
  import {possiblyInListIntervals} from '~/utils/intervals'
  import MakeLinks from '../../components/MakeLinks'
  import InCurrentListSong from '../../components/InCurrentListSong'
  import Spotify from '../../components/Spotify'

  export default {
    components: {
      Spotify,
      InCurrentListSong,
      MakeLinks,
      EntryCount,
      PageTitle,
      Lyrics,
      TijdlozeGraph: Graph
    },
    computed: {
      song() {
        return this.$store.getters['entities/songs']().withAll().find(this.fullSongData.id);
      },
      language() {
        return this.$store.getters.languagesById[this.fullSongData.languageId];
      },
      years() {
        return this.$store.getters.years;
      },
      currentYear() {
        return this.$store.getters.currentYear;
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
      },
      intervals() {
        return possiblyInListIntervals([this.song], this.years, true);
      }
    },
    async asyncData({ params, app }) {
      return {
        fullSongData: await app.$axios.$get(`song/${params.id}`)
      };
    },
    head() {
      return {
        title: `${this.song.title} (${this.song.artist.fullName})`
      }
    }
  }
</script>

<style lang="less" scoped>
    div.allPositions {
        margin: 1em 3em;
        text-align: center;

        table {
            width: 160px;
        }
    }

    div.lyrics {
        white-space: pre-line;
        font-style: italic;
        font-size: 14px;
    }
</style>
