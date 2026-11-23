<template lang="pug">
.searchBox(ref="searchBoxContainer")
  v-autocomplete(
    v-model="selectedResult"
    v-model:search="query"
    :items="renderedResults"
    :item-title="getItemTitle"
    :item-value="(r) => `${r.type}-${r.item.id}`"
    :placeholder="placeholder"
    :autofocus="autofocus"
    menu-icon=""
    :menu-props="menuProps"
    no-filter
    return-object
    hide-details
    density="compact"
    autocomplete="off"
    spellcheck="false"
    persistent-placeholder
    ref="autocomplete"
    @update:modelValue="onSelect"
    v-model:menu="menuOpen"
  )
    template(#prepend-inner)
      v-icon(:icon="mdiMagnify")
    template(#item="{ item, props: itemProps }")
      v-list-item(v-bind="itemProps" title="" class="pa-0")
        song-with-cover(v-if="item.raw.type === 'song'" :song="item.raw.item" plain-artist plain-title)
        album-with-cover(v-if="item.raw.type === 'album'" :album="item.raw.item" plain-artist plain-title)
        artist-with-icon(v-if="item.raw.type === 'artist'" :artist="item.raw.item" plain-title)
    template(#no-data)
      .more-suggestions(v-if='query.length > 0')
        | Geen resultaten gevonden.
</template>

<script setup lang="ts">
import Artist from "~/orm/Artist";
import Song from "~/orm/Song";
import Album from "~/orm/Album";
import type Year from "~/orm/Year";
import {useRepo} from "pinia-orm"
import {mdiMagnify} from "@mdi/js";
import { sortBy } from 'ramda'
import type { VAutocomplete } from 'vuetify/components'
import type { LocationStrategyFunction } from 'vuetify'

const emit = defineEmits(['initialResults', 'selectSearchResult'])
const MAX_RENDERED_RESULTS = 50

type SearchResultArtist = { type: 'artist'; item: Artist; score: number; query?: string }
type SearchResultSong = { type: 'song'; item: Song; score: number; query?: string }
type SearchResultAlbum = { type: 'album'; item: Album; score: number; query?: string }
type SearchResult = SearchResultArtist | SearchResultSong | SearchResultAlbum
type SearchType = SearchResult['type']
type SearchResultByType = {
  artist: SearchResultArtist
  song: SearchResultSong
  album: SearchResultAlbum
}

const query = defineModel({
  type: String,
  default: ''
})

const props = withDefaults(defineProps<{
  placeholder?: string
  songFilter?: (song: Song) => boolean
  artistFilter?: (artist: Artist) => boolean
  albumFilter?: (album: Album) => boolean
  songsYear?: Year
  autofocus?: boolean
  fillAvailableHeight?: boolean
  menuAttach?: string
}>(), {
  placeholder: 'Artiest, album, nummer',
  songFilter: () => true,
  artistFilter: () => true,
  albumFilter: () => true,
  autofocus: false,
  fillAvailableHeight: false,
  menuAttach: undefined,
})

const fillAvailableHeightLocationStrategy: LocationStrategyFunction = (data, _props, contentStyles) => {
  const updateLocation = () => {
    const target = data.target.value
    if (!(target instanceof HTMLElement)) return

    const bounds = target.getBoundingClientRect()
    Object.assign(contentStyles.value, {
      position: 'fixed',
      top: `${bounds.bottom}px`,
      bottom: '8px',
      left: `${bounds.left}px`,
      right: 'auto',
      width: `${bounds.width}px`,
      maxHeight: 'none',
    })
  }

  updateLocation()
  return { updateLocation }
}

const autocomplete = useTemplateRef<InstanceType<typeof VAutocomplete>>('autocomplete')
const searchBoxContainer = useTemplateRef('searchBoxContainer')
const { width: searchBoxWidth } = useElementSize(searchBoxContainer)

const selectedResult = ref<SearchResult | null>(null)
const searchActive = ref(false)
const menuProps = computed(() => {
  return {
    locationStrategy: props.fillAvailableHeight ? fillAvailableHeightLocationStrategy : 'connected',
    maxHeight: props.fillAvailableHeight ? 'none' : 450,
    width: searchBoxWidth.value || undefined,
    attach: props.menuAttach,
    contentClass: 'search-results-menu',
  }
})

const menuOpen = computed({
  get: () => !!query.value && searchActive.value,
  set: (val) => onMenuUpdate(val)
})

const allArtists = computed(() => {
  return useRepo(Artist).all().filter(props.artistFilter);
})
const allSongs = computed(() => {
  return useRepo(Song).with('artist').with('secondArtist').with('album').get().filter(props.songFilter);
})
const allAlbums = computed(() => {
  return useRepo(Album).with('artist').get().filter(props.albumFilter);
})

const results = computed<SearchResult[]>(() => {
  if (!query.value) {
    return []
  }

  const queryFragments = useSearchQueryFragments(query.value)
  const artists = search(queryFragments, allArtists.value, useSearchArtistContent, 'artist');
  const songs = search(queryFragments, allSongs.value, useSearchSongContent, 'song');
  const albums = search(queryFragments, allAlbums.value, useSearchAlbumContent, 'album');

  return sortBy((result: SearchResult) => -result.score, [artists, songs, albums].flat())
})
const renderedResults = computed(() => results.value.slice(0, MAX_RENDERED_RESULTS))

const { gtag } = useGtag()
watch(query, () => {
  emit('initialResults', results.value);

  if (query.value) {
    gtag('event', 'search', {
      query: query.value,
      result_count: results.value.length,
      path: useRoute().path
    })
  }
})

function getItemTitle(result: SearchResult): string {
  if (result.type === 'artist') return result.item.name
  if (result.type === 'song') return result.item.title
  if (result.type === 'album') return result.item.artist.name
  return ''
}

function onMenuUpdate(isOpen: boolean) {
  searchActive.value = isOpen
}

async function onSelect(result: SearchResult | null) {
  if (result) {
    result.query = query.value
    emit('selectSearchResult', result)
    await nextTick()
    query.value = ''
    selectedResult.value = null
  }
}

function search<T extends Artist | Song | Album, K extends SearchType>(
  queryFragments: string[],
  data: T[],
  matchAttribute: (item: T) => string,
  type: K
): SearchResultByType[K][] {
  return data.filter(useSearchFilter(queryFragments, matchAttribute)).map(item => {
    let score = useSearchScore(query.value, matchAttribute(item));
    if (props.songsYear && type === 'song') {
      score = score / 100 + ((item as Song).position(props.songsYear) ?? 0);
    }

    return {type, item, score} as SearchResultByType[K]
  });
}

onKeyStroke('Escape', () => {
  if (query.value) {
    query.value = '';
  }
})

const isVisible = useElementVisibility(searchBoxContainer)

onStartTyping(() => {
  if (isVisible.value && !autocomplete.value?.focused) {
    autocomplete.value?.focus()
  }
})

defineExpose({
  searchActive
})
</script>

<style scoped>
  @import "../assets/styleConfig.css";

  .searchBox {
    margin: 10px 0;
    font-size: 16px;
  }

  .more-suggestions {
    padding: 5px 16px;
    font-size: 85%;
    font-style: italic;
    color: #777;
  }

  :global(.search-results-menu) {
    overflow: hidden;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }

  :global(.search-results-menu .v-list-item),
  :global(.search-results-menu .itemWithMedia) {
    min-width: 0;
    overflow: hidden;
  }

  :global(.search-results-menu .itemWithMedia) {
    width: 100%;
  }

  :global(.search-results-menu .itemWithMedia > div:last-child) {
    flex: 1;
    min-width: 0;
  }

  :global(.search-results-menu .itemWithMedia .title),
  :global(.search-results-menu .itemWithMedia .subtitle) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
