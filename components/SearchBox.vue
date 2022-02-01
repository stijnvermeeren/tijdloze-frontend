<template lang="pug">
  #searchBox
    span.fa.fa-search
    input(type='text' :placeholder='placeholder' autocomplete='off' spellcheck='false' v-model='query' @keyup.down='move(1)' @keyup.up='move(-1)' @keyup.enter='go(selectedIndex)' @keydown.up.prevent='() => true' @keydown.down.prevent='() => true' ref="input")
    #searchResults(v-if='query.length > 0')
      .suggestion(v-for='(result, index) in visibleResults' @click='go(index)' @mousemove='selectedIndex = index' :class='{selected: index === selectedIndex}')
        div(v-if="result.type === 'artist'")
          | {{result.item.fullName}}
        div(v-if="result.type === 'song'")
          | {{result.item.title}}
          span.info
            | (nummer van #[span.artiest {{result.item.artist.fullName}}]
            template(v-if='result.item.secondArtist')
              |
              | en #[span.artiest {{result.item.secondArtist.fullName}}]
            template(v-if='songsYear && result.item.position(songsYear, true)')
              | ; positie {{result.item.position(songsYear, true)}} in {{songsYear.yyyy}}
            | )
        div(v-if="result.type === 'album'")
          | {{result.item.title}}
          span.info
            | (album van #[span.artiest {{result.item.artist.fullName}}] uit {{result.item.releaseYear}})
      .more-suggestions(v-if='resultsCount > resultsLimit')
        | Nog {{resultsCount - resultsLimit}} andere treffer{{resultsCount - resultsLimit > 1 ? 's' : ''}}.
      .more-suggestions(v-if='resultsCount === 0')
        | Geen resultaten gevonden.
</template>

<script>
  import _ from 'lodash';
  import Artist from "@/orm/Artist";
  import Song from "@/orm/Song";
  import Album from "@/orm/Album";

  export default {
    props: {
      placeholder: {
        type: String,
        default: 'Zoek artiest, album of nummer...'
      },
      songFilter: {
        type: Function,
        default: song => true
      },
      artistFilter: {
        type: Function,
        default: artist => true
      },
      albumFilter: {
        type: Function,
        default: album => true
      },
      songsYear: {
        type: Object
      },
      initialQuery: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        query: this.initialQuery,
        selectedIndex: undefined,
        resultsLimit: 10
      }
    },
    computed: {
      results() {
        if (!this.query) {
          return []
        }

        const artists = this.search(
          Artist.all().filter(this.artistFilter),
          artist => artist.fullName,
          'artist'
        );

        const songs = this.search(
          Song.query().with('artist').with('secondArtist').all().filter(this.songFilter),
          song => {
            let matchData = `${song.title} ${song.artist.fullName}`;
            if (song.secondArtist) {
              matchData += ` ${song.secondArtist.fullName}`
            }
            return matchData
          },
          'song'
        );

        const albums = this.search(
          Album.query().with('artist').all().filter(this.albumFilter),
          album => `${album.title} ${album.artist.fullName}`,
          'album'
        );

        const sortedResults = _.sortBy(
          _.concat(artists, songs, albums),
          result => -result.score
        );
        return sortedResults
      },
      visibleResults() {
        return _.take(this.results, this.resultsLimit);
      },
      resultsCount() {
        return this.results.length;
      }
    },
    watch: {
      query() {
        this.selectedIndex = undefined;
      },
      initialQuery(newValue) {
        this.$refs.input.focus();
        this.query = newValue;
        this.$emit('initialResultCount', this.resultsCount);
      }
    },
    methods: {
      normalize(input) {
        return input
          .toLowerCase()
          .normalize("NFD")
          .replace(/æ/g, "ae")
          .replace(/ing\b/g, "in") // match e.g. "loving" with "lovin"
          .replace(/\bo\b/g, "of") // match "o" with "of"
          .replace(/[\u0300-\u036f]/g, "") // combining accents
          .replace(/[^a-zA-Z0-9 ]/g, "")
      },
      search(data, matchAttribute, type) {
        const fragments = this.normalize(this.query).split(" ");
        return data.filter(item => {
          return _.every(
            fragments,
            fragment => !fragment || this.normalize(matchAttribute(item)).indexOf(fragment) > -1
          )
        }).map(item => {
          let score = this.score(this.query, matchAttribute(item));
          if (this.songsYear && type === 'song') {
            score = score / 100 + item.position(this.songsYear);
          }

          return {type, item, score}
        });
      },
      score(query, match) {
        query = this.normalize(query);
        match = this.normalize(match);
        if (query === match) {
          return 3;
        } else if (match.startsWith(query)) {
          return 2;
        } else {
          return 1;
        }
      },
      move(offset) {
        if (this.selectedIndex === undefined) {
          if (offset >= 0) {
            this.selectedIndex = -1;
          } else {
            this.selectedIndex = 0;
          }
        }
        this.selectedIndex = this.mod(this.selectedIndex + offset, this.results.length);
      },
      mod(n, m) {
        return ((n % m) + m) % m;
      },
      go(index) {
        if (index !== undefined) {
          const result = this.results[index];
          result.query = this.query;
          this.$emit('selectSearchResult', result);
          this.query = '';
        }
      },
      escapeKeyListener: function (evt) {
        if (evt.code === "Escape" && this.query) {
          this.query = '';
        }
      },
      documentClick (e) {
        const searchBox = document.querySelector('#searchBox');
        const searchResults = document.querySelector('#searchResults');
        const target = e.target;
        if (this.query && !searchBox.contains(target) && !searchResults.contains(target) && !this.initialQuery) {
          this.query = '';
        }
      }
    },
    created: function() {
      if (process.client) {
        document.addEventListener('keyup', this.escapeKeyListener);
        document.addEventListener('click', this.documentClick);
      }
    },
    destroyed: function() {
      if (process.client) {
        document.removeEventListener('keyup', this.escapeKeyListener);
        document.removeEventListener('click', this.documentClick);
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../assets/styleConfig.less";

  #searchBox {
    position: relative;
    margin: 10px 0;
    font-size: 16px;

    .fa-search {
      position: absolute;
      top: 8px;
      left: 10px;
      z-index: 1;
    }

    input {
      width: 100%;
      height: 28px;
      text-indent: 32px;

      background: @inputBackgroundColor;
      border: 1px solid #aaa;
      border-radius: 5px;
      box-shadow: 0 0 3px #ccc, 0 10px 15px #ebebeb inset;

      position: relative;
      vertical-align: top;
    }

    #searchResults {
      width: 100%;
      border: 1px solid #999;
      background: @inputBackgroundColor;
      overflow: auto;

      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1001;
      right: auto;

      font-size: 80%;
      text-align: left;

      > div {
        padding: 0.2em 0.5em;
        white-space: nowrap;
        overflow: hidden;
        border-bottom: 1px solid black;
        font-size: 89%;


        &.suggestion {
          cursor: pointer;

          span.info {
            display: block;
            margin-left: 2em;
            font-size: 80%;
            span.artiest {
              font-weight: bold;
            }
          }

          &.selected {
            background: @headerBackgroundColor;
          }
        }

        &.more-suggestions {
          font-size: 80%;
          font-style: italic;
        }
      }
    }
  }
</style>
