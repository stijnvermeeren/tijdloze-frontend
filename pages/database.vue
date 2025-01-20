<template lang="pug">
Title Volledige database
div
  h2 Volledige database
  ui-alert(title="Database downloaden")
    | Zie #[nuxt-link(to='/website/opendata') open data] voor mogelijkheden om de hele database the downloaden.
  v-container
    v-row(dense)
      v-col.spanInputMix
        v-select.inline(v-model="filter" :items="filterOptions" density="compact" :hide-details="true")
        v-select.inline(v-model="cutoff" :items="cutoffOptions" density="compact" :hide-details="true")
        span van
        v-select.inline.selectYear(v-model='startYear' :items="yearOptions" density="compact" :hide-details="true")
        span tot en met
        v-select.inline.selectYear(v-model='endYear' :items="yearOptions" density="compact" :hide-details="true")
    v-row(dense)
      v-col
        country-filter(v-model='countryFilter')
      v-col
        language-filter(v-model='languageFilter')
      v-col
        lead-vocals-filter(v-model='leadVocalsFilter')
    v-row.mt-8(dense)
      v-col
        v-range-slider(
          :model-value="releaseYearRange"
          @update:model-value="updateReleaseYearRange"
          :min="lowestReleaseYear"
          :max="highestReleaseYear"
          :step="1"
          :show-ticks="true"
          thumb-label="always"
          density="compact"
          :hide-details="true"
          label="Jaar van release"
        )

  ui-alert.alert(v-if="showWarning" :title="`Tijdloze van ${currentYear.yyyy} nog onvolledig`" type="warning")
    | De statistieken kunnen nog veranderen.

  div.list
    div.entry.header.pb-1
      div.r
      div.c
        v-btn-toggle(v-model="type" color="blue" density="comfortable" variant="outlined")
          v-btn(value='nummers') Nummers
          v-btn(value='artiesten') Artiesten
          v-btn(value='albums') Albums
      div.p
        v-select(v-model="scoreMethod" :items="scoreMethodOptions" hide-details density="compact")
    v-no-ssr
      div.content
        div.wrapper
          RecycleScroller.scroller(:items="data" :item-size="24" key-field="key" :buffer="40")
            template(#default="{ item, index }")
              div.entry(:class="{lineBelow: index % 5 === 4}")
                div.r
                  | {{ item.position }}
                div.c
                  div.a(v-if="type === 'nummers'")
                    song-artist-link(:song='item.entry.song')
                  div.a(v-else)
                    artist-link(:artist='item.entry.artist')
                  div(v-if="type === 'nummers'")
                    song-link(:song='item.entry.song')
                  div(v-if="type === 'albums'")
                    album-link(:album='item.entry.album')
                div.p {{ Math.round(item.entry.points * 10) / 10 }}
</template>

<script setup>
import _ from 'lodash'

import ranking from '~/utils/ranking';
import Artist from "@/orm/Artist";
import Album from "../orm/Album";
import {useRootStore} from "~/stores/root";
import {useRepo} from "pinia-orm";

const TYPE_SONGS = 'nummers'
const TYPE_ALBUMS = 'albums'
const TYPE_ARTISTS = 'artiesten'
const validTypes = new Set([TYPE_SONGS, TYPE_ALBUMS, TYPE_ARTISTS])

function parseType(value) {
  return validTypes.has(value) ? value : TYPE_SONGS
}

const FILTER_ANY = 'alle'
const FILTER_NO_EXIT = 'geen_exit'
const FILTER_ALL_YEARS = 'alle_jaren'
const validFilters = new Set([FILTER_ANY, FILTER_NO_EXIT, FILTER_ALL_YEARS])
const filterOptions = [
  {title: 'In minstens een', value: FILTER_ANY},
  {title: 'In elke', value: FILTER_ALL_YEARS},
  {title: 'Niet weggevallen uit de', value: FILTER_NO_EXIT}
]

function parseFilter(value) {
  return validFilters.has(value) ? value : FILTER_ANY
}

const CUTOFF_TOP100 = 'top100'
const CUTOFF_FULL = 'full'
const validCutoffs = new Set([CUTOFF_TOP100, CUTOFF_FULL])
const cutoffOptions = [
  {title: 'top 100', value: CUTOFF_TOP100},
  {title: 'volledige lijst', value: CUTOFF_FULL}
]

function parseCutoff(value) {
  return validCutoffs.has(value) ? value : CUTOFF_TOP100
}

const SCORE_ENTRY_COUNT = 'entry_count'
const SCORE_SONG_COUNT = 'song_count'
const SCORE_BORDA = 'borda'
const SCORE_YEAR_ASC = 'year_asc'
const SCORE_YEAR_DESC = 'year_desc'
const validScoreMethods = {}
validScoreMethods[TYPE_SONGS] = [SCORE_ENTRY_COUNT, SCORE_BORDA, SCORE_YEAR_ASC, SCORE_YEAR_DESC];
validScoreMethods[TYPE_ALBUMS] = [SCORE_ENTRY_COUNT, SCORE_SONG_COUNT, SCORE_BORDA, SCORE_YEAR_ASC, SCORE_YEAR_DESC];
validScoreMethods[TYPE_ARTISTS] = [SCORE_ENTRY_COUNT, SCORE_SONG_COUNT, SCORE_BORDA];
const sumEntriesScoreMethods = new Set([SCORE_ENTRY_COUNT, SCORE_BORDA])
const sumSongsScoreMethods = new Set([SCORE_ENTRY_COUNT, SCORE_SONG_COUNT, SCORE_BORDA])

function parseScoreMethod(value, type) {
  const validScoreMethodsForType = validScoreMethods[type]
  if  (validScoreMethodsForType) {
    return new Set(validScoreMethodsForType).has(value) ? value : _.first(validScoreMethodsForType)
  } else {
    return SCORE_ENTRY_COUNT
  }
}

const isMounted = ref(false)
const type = ref(parseType(useRoute().query.type))
const filter = ref(parseFilter(useRoute().query.filter))
const cutoff = ref(parseCutoff(useRoute().query.cutoff))
const startYear = ref(useRoute().query.start || _.first(useRootStore().years)?.yyyy)
const endYear = ref(useRoute().query.einde || useRootStore().lastCompleteYear?.yyyy)
const minReleaseYear = ref(parseInt(useRoute().query.minReleaseYear))
const maxReleaseYear = ref(parseInt(useRoute().query.maxReleaseYear))
const scoreMethod = ref(parseScoreMethod(useRoute().query.score, type.value))
const countryFilter = ref(useRoute().query.land)
const languageFilter = ref(useRoute().query.taal)
const leadVocalsFilter = ref(useRoute().query.leadVocals)

const lowestReleaseYear = computed(() => {
  return _.min(useRepo(Album).all().map(album => album.releaseYear))
})
const highestReleaseYear = computed(() => {
  return _.max(useRepo(Album).all().map(album => album.releaseYear))
})
const releaseYearRange = computed(() => {
  return [minReleaseYear.value, maxReleaseYear.value]
})
const queryParams = computed(() => {
  const allParams = {
    type: type.value,
    start: startYear.value?.toString(),
    einde: endYear.value?.toString(),
    filter: filter.value,
    cutoff: cutoff.value,
    score: scoreMethod.value,
    land: countryFilter.value,
    taal: languageFilter.value,
    leadVocals: leadVocalsFilter.value,
    minReleaseYear: minReleaseYear.value,
    maxReleaseYear: maxReleaseYear.value
  };

  // Don't include undefined/empty params in the URL
  return Object.fromEntries(Object.entries(allParams).filter(([_, value]) => value))
})
const query = computed(() => {
  return useRoute().query;
})
const extended = computed(() => {
  return cutoff.value === CUTOFF_FULL;
})
const selectedSongs = computed(() => {
  return applyFilters(useRootStore().songs);
})
const years = computed(() => {
  return useRootStore().years;
})
const yearOptions = computed(() => {
  return years.value.map(year => {
    return {
      title: year.yyyy,
      value: year.yyyy
    }
  })
})
const currentYear = computed(() => {
  return useRootStore().currentYear;
})
const selectedYears = computed(() => {
  return years.value.filter(year => year.yyyy >= startYear.value && year.yyyy <= endYear.value);
})
const showWarning = computed(() => {
  return useRootStore().listInProgress && endYear.value >= currentYear.value.yyyy
})
const sortAscending = computed(() => {
  return scoreMethod.value === SCORE_YEAR_ASC
})
const songScoreFn = computed(() => {
  if (sumEntriesScoreMethods.has(scoreMethod.value)) {
    return song => _.sum(
      selectedYears.value
        .map(year => song.position(year, extended.value))
        .filter(position => position)
        .map(entryScoreFn.value)
    )
  } else if (scoreMethod.value === SCORE_YEAR_DESC || scoreMethod.value === SCORE_YEAR_ASC) {
    return song => song.album.releaseYear
  } else {
    return song => 1
  }
})
const entryScoreFn = computed(() => {
  if (scoreMethod.value === SCORE_BORDA) {
    return position => {
      return (position > 100) ? 0 : 101 - position;
    }
  } else {
    return position => 1;
  }
})
const rawData = computed(() => {
  return selectedSongs.value.map(song => {
    return {
      song: song,
      key: song.id,
      artist: song.artist,
      points: songScoreFn.value(song)
    }
  });
})
const data = computed(() => {
  if (isMounted.value) {
    if (type.value === TYPE_ARTISTS) {
      return artistData.value;
    } else if (type.value === TYPE_ALBUMS) {
      return albumData.value;
    } else {
      return songData.value;
    }
  } else {
    // default values for computations on server-side, to prevent high load on server
    return []
  }
})
const songData = computed(() => {
  return ranking(
    rawData.value.filter(item => item.points > 0),
    sortAscending.value ? (item => item.points) : (item => -item.points),
    item => item.song.title,
  )
})
const artistData = computed(() => {
  const primaryScores = _.groupBy(rawData.value, item => item.song.artistId)
  const secondaryScores = _.groupBy(
    rawData.value.filter(item => item.song.secondArtistId),
    item => item.song.secondArtistId
  )

  const data = useRepo(Artist).all().map(artist => {
    const primaryItems = primaryScores[artist.id] ? primaryScores[artist.id] : [];
    const secondaryItems = secondaryScores[artist.id] ? secondaryScores[artist.id] : [];

    const score = _.sum(primaryItems.concat(secondaryItems).map(item => item.points))

    return {
      artist: artist,
      key: artist.id,
      points: score
    }
  }).filter(items => items.points > 0)

  return ranking(
    data.filter(item => item.points > 0),
    sortAscending.value ? (item => item.points) : (item => -item.points),
    item => item.artist.name,
  )
})
const albumData = computed(() => {
  const data = _.values(_.groupBy(rawData.value, item => item.song.albumId)).map(items => {
    const aggregateFunction = sumSongsScoreMethods.has(scoreMethod.value) ? _.sum : _.head;
    return {
      album: _.first(items).song.album,
      artist: _.first(items).song.artist,
      key: _.first(items).song.album.id,
      points: aggregateFunction(items.map(item => item.points))
    }
  });

  return ranking(
    data.filter(item => item.points > 0),
    sortAscending.value ? (item => item.points) : (item => -item.points),
    item => item.album.title,
  )
})
const scoreMethodOptions = computed(() => {
  const items = [
    {value: SCORE_ENTRY_COUNT, title: "Aantal noteringen"}
  ]
  if (type.value !== 'nummers') {
    items.push({value: SCORE_SONG_COUNT, title: "Aantal verschillende nummers"})
  }

  items.push({value: SCORE_BORDA, title: "Borda count (positie 1 = 100, positie 2 = 99, enz.)"})

  if (type.value !== 'artiesten') {
    items.push({value: SCORE_YEAR_ASC, title: "Jaar van release (stijgend)"})
    items.push({value: SCORE_YEAR_DESC, title: "Jaar van release (dalend)"})
  }

  return items
})

watch(queryParams, (newQueryParams, oldQueryParams) => {
  if (JSON.stringify(newQueryParams) !== JSON.stringify(oldQueryParams)) {
    useRouter().replace({
      query: newQueryParams
    });
  }
})

watch(query, (newQuery) => {
  type.value = parseType(newQuery.type);
  filter.value = parseFilter(newQuery.filter);
  cutoff.value = parseCutoff(newQuery.cutoff);
  startYear.value = newQuery.start ? newQuery.start : _.first(useRootStore().years)?.yyyy;
  endYear.value = newQuery.einde ? newQuery.einde : useRootStore().lastCompleteYear?.yyyy;
  scoreMethod.value = parseScoreMethod(newQuery.score, type.value);
  countryFilter.value = newQuery.land;
  languageFilter.value = newQuery.taal;
  leadVocalsFilter.value = newQuery.leadVocals;
  minReleaseYear.value = parseInt(newQuery.minReleaseYear);
  maxReleaseYear.value = parseInt(newQuery.maxReleaseYear);
})

onMounted(() => {
  isMounted.value = true
  if (!maxReleaseYear.value) {
    maxReleaseYear.value = highestReleaseYear.value
  }
  if (!minReleaseYear.value) {
    minReleaseYear.value = lowestReleaseYear.value
  }
})

function updateReleaseYearRange(newValue) {
  const [minValue, maxValue] = newValue
  minReleaseYear.value = minValue
  maxReleaseYear.value = maxValue
}

function applyFilters(songs) {
  let result = songs;

  if (filter.value === FILTER_ALL_YEARS) {
    result = result.filter(song =>
        selectedYears.value.every(year => song.position(year, extended.value))
    );
  } else if (filter.value === FILTER_NO_EXIT) {
    result = result.filter(song =>
        selectedYears.value.slice(1).every(year =>
            !song.position(year.previous, extended.value) || !!song.position(year, extended.value)
        )
    );
  } else if (filter.value === FILTER_ANY) {
    result = result.filter(song =>
        selectedYears.value.some(year => song.position(year, extended.value))
    );
  }

  if (countryFilter.value) {
    result = result.filter(song => song.artist.countryId === countryFilter.value);
  }
  if (languageFilter.value) {
    result = result.filter(song => song.languageId === languageFilter.value);
  }
  if (leadVocalsFilter.value) {
    result = result.filter(song => song.leadVocals === leadVocalsFilter.value);
  }
  if (minReleaseYear.value) {
    result = result.filter(song => song.album.releaseYear >= minReleaseYear.value);
  }
  if (maxReleaseYear.value) {
    result = result.filter(song => song.album.releaseYear <= maxReleaseYear.value);
  }

  return result;
}
</script>

<style lang="scss" scoped>
  .list {
    margin: 20px 0;

    div.entry {
      display: flex;
      justify-content: space-between;

      div {
        flex-basis: 0;
        align-items: stretch;
      }

      &.header {
        font-weight: bold;
        overflow: auto;
        border-bottom: solid black 1px;
        scrollbar-gutter: stable;

        .p {
          text-align: right;
        }
        .c {
          flex-basis: -150px;
        }
        .p {
          flex-basis: 150px;
        }
      }

      .r {
        text-align: center;
        font-weight: bold;
        flex-grow: 1;
      }
      .c {
        flex-grow: 10;
        display: flex;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        div {
          margin: 0 10px;
          flex-grow: 1;

          &.a {
            flex-grow: 0.8;
          }
        }
      }
      .p {
        text-align: center;
        flex-grow: 2;
      }
    }

    div.content {
      flex: 100% 1 1;
      position: relative;
      height: 400px;

      .wrapper {
        overflow: hidden;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        .scroller {
          width: 100%;
          height: 100%;

          div.entry {
            height: 24px;

            &.lineBelow {
              border-bottom: 1px #888888 dotted;
            }
          }
        }
      }
    }
  }

  .spanInputMix {
    text-align: left;
    > * {
      vertical-align: middle;
      margin: 0 4px;
    }
  }

  div.inline {
    display: inline-block;
    width: auto;
  }

  div.minWidth {
    min-width: 200px;
  }

  table.lijst {
    margin-top: 2em;
  }

  .alert {
    margin-top: 10px;
    margin-bottom: 15px;
  }
</style>
