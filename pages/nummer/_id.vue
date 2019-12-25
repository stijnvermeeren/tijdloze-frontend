<template lang="pug">
  .container
    page-title(icon='song' icon-alt='Nummer')
      h2 {{song.title}}
    table.info
      tbody
        tr.important
          th Nummer van
          td
            tijdloze-artist(:artist='song.artist')
        tr
          th Origineel op album
          td
            tijdloze-album(:album='song.album')
            |
            | ({{ song.album.releaseYear }})
        tr(:class='{unimportant: !song.probablyInList(currentYear)}')
          th In de Tijdloze
          td
            in-current-list-song(:song='song')
        tr.unimportant(v-if='links.length')
          th Externe links
          td
            div(v-for='(link, index) in links' :key='index')
              a(:href='link.href') {{ link.title }}
        tr.unimportant(v-if='fullSongData.notes')
          td(colspan='2')
            make-links(:text='fullSongData.notes')

    lyrics(v-if='fullSongData.lyrics')
      .spotify.withLyrics(v-if='fullSongData.spotifyId')
        div
          spotify(:spotify-id='fullSongData.spotifyId')
        div Beluister fragment via Spotify
      .lyrics {{ fullSongData.lyrics }}

    div(v-else-if="fullSongData.spotifyId")
      h3 Beluister fragment via Spotify
      .spotify(v-if='fullSongData.spotifyId' :class="{withLyrics: fullSongData.languageId === 'ins'}")
        div
          spotify(:spotify-id='fullSongData.spotifyId')
      div(v-if="fullSongData.languageId === 'ins'") (Instrumentaal nummer)
      .clear

    div(v-else-if="fullSongData.languageId === 'ins'")
      h3 Lyrics
      div (Instrumentaal nummer)
      .clear

    h3 In de Tijdloze
    div
      entry-count(:songs='[song]')
    tijdloze-graph(v-if='song.listCount($store.getters.years) > 0' :songs='[song]' :no-label='true')
    .allPositions
      table
        tbody
          tr
            th Jaar
            th Positie
          template(v-for='(interval, index) in intervals')
            tr(v-if='index')
              td ...
              td
            tr(v-for='year in interval' :key='year.yyyy')
              th
                tijdloze-year(:year='year')
              td
                tijdloze-position-change(:song='song' :year='year')
                tijdloze-position(:song='song' :year='year')
</template>

<script>
  import Lyrics from "~/components/Lyrics";
  import Graph from '~/components/d3/Graph'
  import PageTitle from '../../components/PageTitle'
  import EntryCount from '../../components/EntryCount'
  import {probablyInListIntervals} from '~/utils/intervals'
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
        return probablyInListIntervals([this.song], this.years, true);
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

    div.spotify {
        margin-bottom: 20px;

        &.withLyrics {
          @media (min-width: 1200px) {
            float: right;
          }
        }

        iframe {
            border: 1px solid grey;
        }

        div {
            font-size: 12px;
            font-style: italic;
            text-align: center;
        }
    }


    table.info > tbody > tr > th {
        width: 150px;
    }
</style>
