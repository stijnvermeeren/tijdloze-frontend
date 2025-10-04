<template lang="pug">
.searchBox(ref="searchBoxContainer")
  v-text-field(
    :label='placeholder'
    persistent-placeholder
    autocomplete='off'
    spellcheck='false'
    v-model='query'
    @keyup.down='move(1)'
    @keyup.up='move(-1)'
    @keyup.enter='go(selectedIndex)'
    @keydown.up.prevent='() => true'
    @keydown.down.prevent='() => true'
    @focus="searchActive = true"
    @blur="onBlur"
    ref="input"
    hide-details
    density="compact"
  )
    template(#prepend-inner)
      v-icon(:icon="mdiMagnify")
  #searchResults(v-if='query.length > 0 && searchActive')
    .suggestion(
      v-for='(result, index) in visibleResults'
      @click='go(index)'
      @mousemove='selectedIndex = index'
      :class='{selected: index === selectedIndex}'
      tabindex="-1"
    )
      div(v-if="result.type === 'artist'")
        | {{result.item.name}}
      div(v-if="result.type === 'song'")
        | {{result.item.title}}
        span.info
          | (nummer van #[span.artiest {{result.item.artist.name}}]
          template(v-if='result.item.secondArtist')
            |
            | en #[span.artiest {{result.item.secondArtist.name}}]
          template(v-if='songsYear && result.item.position(songsYear, true)')
            | ; positie {{result.item.position(songsYear, true)}} in {{songsYear.yyyy}}
          | )
      div(v-if="result.type === 'album'")
        album-title(:album="result.item")
        span.info
          | (album van #[span.artiest {{result.item.artist.name}}] uit {{result.item.releaseYear}})
    .more-suggestions(v-if='resultsCount > resultsLimit')
      | Nog {{resultsCount - resultsLimit}} andere treffer{{resultsCount - resultsLimit > 1 ? 's' : ''}}.
    .more-suggestions(v-if='resultsCount === 0')
      | Geen resultaten gevonden.
</template>

<script setup>
import Artist from "~/orm/Artist";
import Song from "~/orm/Song";
import Album from "~/orm/Album";
import {useRepo} from "pinia-orm"
import {mdiMagnify} from "@mdi/js";
import {onStartTyping, onKeyStroke, useElementVisibility} from "@vueuse/core";
import { sortBy } from 'ramda'

const emit = defineEmits(['initialResults', 'selectSearchResult'])

const query = defineModel({
  type: String,
  default: ''
})

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Zoek artiest, album of nummer'
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
  }
})

const input = useTemplateRef('input')
const searchBoxContainer = useTemplateRef('searchBoxContainer')

const selectedIndex = ref(undefined)
const searchActive = ref(false)

const resultsLimit = 10

const allArtists = computed(() => {
  return useRepo(Artist).all().filter(props.artistFilter);
})
const allSongs = computed(() => {
  return useRepo(Song).with('artist').with('secondArtist').get().filter(props.songFilter);
})
const allAlbums = computed(() => {
  return useRepo(Album).with('artist').get().filter(props.albumFilter);
})
const results = computed(() => {
  if (!query.value) {
    return []
  }

  const queryFragments = useSearchQueryFragments(query.value)
  const artists = search(queryFragments, allArtists.value, useSearchArtistContent, 'artist');
  const songs = search(queryFragments, allSongs.value, useSearchSongContent, 'song');
  const albums = search(queryFragments, allAlbums.value, useSearchAlbumContent, 'album');

  return sortBy(result => -result.score)(
    [artists, songs, albums].flat()
  );
})
const visibleResults = computed(() => {
  return results.value.slice(0, resultsLimit);
})
const resultsCount = computed(() => {
  return results.value.length;
})


watch(query, () => {
  selectedIndex.value = undefined;
  input.value.focus();
  emit('initialResults', results.value);
})

function onBlur(event) {
  if (searchBoxContainer.value) {
    if (!searchBoxContainer.value.contains(event.relatedTarget)) {
      searchActive.value = false
    }
  }
}
function search(queryFragments, data, matchAttribute, type) {
  return data.filter(useSearchFilter(queryFragments, matchAttribute)).map(item => {
    let score = useSearchScore(query.value, matchAttribute(item));
    if (props.songsYear && type === 'song') {
      score = score / 100 + item.position(props.songsYear);
    }

    return {type, item, score}
  });
}
function move(offset) {
  if (selectedIndex.value === undefined) {
    if (offset >= 0) {
      selectedIndex.value = -1;
    } else {
      selectedIndex.value = 0;
    }
  }
  selectedIndex.value = mod(selectedIndex.value + offset, visibleResults.value.length);
}
function mod(n, m) {
  return ((n % m) + m) % m;
}
function go(index) {
  if (index !== undefined) {
    const result = results.value[index];
    result.query = query.value;
    emit('selectSearchResult', result);
    query.value = '';
    searchActive.value = false;
  }
}

onKeyStroke('Escape', () => {
  if (query.value) {
    query.value = '';
  }
})

const isVisible = useElementVisibility(searchBoxContainer)

onStartTyping(() => {
  if (isVisible.value && !input.value.focused) {
    input.value.focus()
  }
})

defineExpose({
  searchActive
})
</script>

<style lang="scss" scoped>
  @use "../assets/styleConfig";

  .searchBox {
    position: relative;
    margin: 10px 0;
    font-size: 16px;
    overflow: visible;

    input {
      width: 100%;
      height: 28px;
      text-indent: 30px;

      background: styleConfig.$inputBackgroundColor;
      border: 1px solid #aaa;
      border-radius: 5px;
      box-shadow: 0 0 3px #ccc, 0 10px 15px #ebebeb inset;

      position: relative;
      vertical-align: top;
    }

    #searchResults {
      width: 100%;
      border: 1px solid #999;
      background: styleConfig.$inputBackgroundColor;
      overflow: auto;

      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1;
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
            background: styleConfig.$headerBackgroundColor;
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
