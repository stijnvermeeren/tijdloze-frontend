<template>
    <div id="searchBox">
        <input
            type="text"
            placeholder="Zoek artiest, album of nummer..."
            autocomplete="off"
            spellcheck="false"
            v-model="query"
            @keyup.down="move(1)"
            @keyup.up="move(-1)"
            @keyup.enter="go(selectedIndex)"
            @keydown.up.prevent="() => true"
            @keydown.down.prevent="() => true"
        />
        <div v-if="results.length" class="suggestions">
            <div
                v-for="(result, index) in visibleResults"
                @click="go(index)"
                @mousemove="selectedIndex = index"
                class="suggestion"
                :class="{selected: index === selectedIndex}"
            >
                <div v-if="result.type === 'artist'">
                    {{result.item.fullName}}
                </div>
                <div v-if="result.type === 'song'">
                    {{result.item.title}}
                    <span class="info">(nummer van <span class="artiest">{{result.item.artist.fullName}}</span>)</span>
                </div>
                <div v-if="result.type === 'album'">
                    {{result.item.title}}
                    <span class="info">(album van <span class="artiest">{{result.item.artist.fullName}}</span>)</span>
                </div>
            </div>
            <div v-if="resultsCount > resultsLimit" class="more-suggestions">
                Nog {{resultsCount - resultsLimit}} andere treffer{{resultsCount - resultsLimit > 1 ? 's' : ''}}.
            </div>
        </div>
    </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    data() {
      return {
        query: "",
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
          this.$store.getters['entities/artists/query']().all(),
          artist => artist.fullName,
          'artist'
        );

        const songs = this.search(
          this.$store.getters['entities/songs/query']().with('artist').all(),
          song => song.title,
          'song'
        );

        const albums = this.search(
          this.$store.getters['entities/albums/query']().with('artist').all(),
          album => album.title,
          'album'
        );

        return _.sortBy(
          _.concat(artists, songs, albums),
          result => -result.score
        );
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
      }
    },
    methods: {
      search(data, matchAttribute, type) {
        return data.filter(item => {
          return matchAttribute(item).toLowerCase().indexOf(this.query.toLowerCase()) > -1
        }).map(item => {
          return {
            type: type,
            item: item,
            score: this.score(this.query, matchAttribute(item))
          }
        });
      },
      score(query, match) {
        query = query.toLowerCase();
        match = match.toLowerCase();
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
        let path = '';
        const result = this.results[index];

        if (!result) {
          return;
        }

        if (result.type === 'song') {
          path = `/nummer/${result.item.id}`
        } else if (result.type === 'artist') {
          path = `/artiest/${result.item.id}`
        } else if (result.type === 'album') {
          path = `/album/${result.item.id}`
        }

        if (path) {
          this.query = '';
          this.$router.push(path);
        }
      }
    }
  }
</script>

<style lang="less" scoped>
    @import "../assets/styleConfig.less";

    @searchBoxWidth: 18em;

    #searchBox {
        position: absolute;
        top: 1em;
        right: 1em;

        input {
            width: @searchBoxWidth;
            background-color: white;
            position: relative;
            vertical-align: top;
        }
    }
    .suggestions {
        width: @searchBoxWidth;
        border: 1px solid #999;
        background: @backgroundColor;
        overflow: auto;

        position: absolute;
        top: 100%;
        left: 0px;
        z-index: 100;
        right: auto;

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
</style>
