<template>
    <div class="container">
        <page-title icon="song" icon-alt="Nummer">
            <h2>{{song.title}}</h2>
            <div class="subtitle">
                <div>Nummer van <strong><tijdloze-artist :artist="song.artist" /></strong></div>
                <div>Origineel op album: <TijdlozeAlbum :album="song.album" /> ({{ song.album.releaseYear }})</div>
                <div v-if="fullSongData.spotifyId" class="spotify">
                    <iframe :src="`https://open.spotify.com/embed/track/${fullSongData.spotifyId}`" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                </div>
            </div>
        </page-title>

        <ul class="info">
            <li>Taal: <strong>{{ language.name }}</strong></li>
            <li v-if="links.length">
                Externe links:
                <span v-for="(link, index) in links" :key="index">
                    <span v-if="index > 0">, </span><a :href="link.href">{{ link.title }}</a>
                </span>
            </li>
            <li v-if="fullSongData.notes">
                <em>{{ fullSongData.notes }}</em>
            </li>
        </ul>

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

  export default {
    components: {
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
    div.subtitle {
        font-size: 16px;
        margin: -10px 0 0 0;

        div.spotify {
            margin: 15px 0;
        }
    }

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
