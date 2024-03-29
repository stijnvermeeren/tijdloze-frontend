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

<script>
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

  export default defineNuxtComponent({
    data() {
      const type = parseType(useRoute().query.type)
      return {
        isMounted: false,
        type,
        filter: parseFilter(useRoute().query.filter),
        cutoff: parseCutoff(useRoute().query.cutoff),
        startYear: useRoute().query.start ? useRoute().query.start : _.first(useRootStore().years)?.yyyy,
        endYear: useRoute().query.einde ? useRoute().query.einde : useRootStore().lastCompleteYear?.yyyy,
        minReleaseYear: parseInt(useRoute().query.minReleaseYear),
        maxReleaseYear: parseInt(useRoute().query.maxReleaseYear),
        scoreMethod: parseScoreMethod(useRoute().query.score, type),
        countryFilter: useRoute().query.land,
        languageFilter: useRoute().query.taal,
        leadVocalsFilter: useRoute().query.leadVocals,
        filterOptions: filterOptions,
        cutoffOptions: cutoffOptions
      }
    },
    computed: {
      lowestReleaseYear() {
        return _.min(useRepo(Album).all().map(album => album.releaseYear))
      },
      highestReleaseYear() {
        return _.max(useRepo(Album).all().map(album => album.releaseYear))
      },
      releaseYearRange() {
        return [this.minReleaseYear, this.maxReleaseYear]
      },
      queryParams() {
        const allParams = {
          type: this.type,
          start: this.startYear?.toString(),
          einde: this.endYear?.toString(),
          filter: this.filter,
          cutoff: this.cutoff,
          score: this.scoreMethod,
          land: this.countryFilter,
          taal: this.languageFilter,
          leadVocals: this.leadVocalsFilter,
          minReleaseYear: this.minReleaseYear,
          maxReleaseYear: this.maxReleaseYear
        };

        // Don't include undefined/empty params in the URL
        return Object.fromEntries(Object.entries(allParams).filter(([_, value]) => value))
      },
      query() {
        return useRoute().query;
      },
      extended() {
        return this.cutoff === CUTOFF_FULL;
      },
      selectedSongs() {
        return this.applyFilters(useRootStore().songs);
      },
      years() {
        return useRootStore().years;
      },
      yearOptions() {
        return this.years.map(year => {
          return {
            title: year.yyyy,
            value: year.yyyy
          }
        })
      },
      currentYear() {
        return useRootStore().currentYear;
      },
      selectedYears() {
        return this.years.filter(year => year.yyyy >= this.startYear && year.yyyy <= this.endYear);
      },
      showWarning() {
        return useRootStore().listInProgress && this.endYear >= this.currentYear.yyyy
      },
      sortAscending() {
        return this.scoreMethod === SCORE_YEAR_ASC
      },
      songScoreFn() {
        if (sumEntriesScoreMethods.has(this.scoreMethod)) {
          const selectedYears = this.selectedYears
          const entryScoreFn = this.entryScoreFn
          const extended = this.extended
          return song => _.sum(
            selectedYears
              .map(year => song.position(year, extended))
              .filter(position => position)
              .map(entryScoreFn)
          )
        } else if (this.scoreMethod === SCORE_YEAR_DESC || this.scoreMethod === SCORE_YEAR_ASC) {
          return song => song.album.releaseYear
        } else {
          return song => 1
        }
      },
      entryScoreFn() {
        if (this.scoreMethod === SCORE_BORDA) {
          return position => {
            return (position > 100) ? 0 : 101 - position;
          }
        } else {
          return position => 1;
        }
      },
      rawData() {
        const songScoreFn = this.songScoreFn;
        return this.selectedSongs.map(song => {
          return {
            song: song,
            key: song.id,
            artist: song.artist,
            points: songScoreFn(song)
          }
        });
      },
      data() {
        if (this.isMounted) {
          if (this.type === TYPE_ARTISTS) {
            return this.artistData;
          } else if (this.type === TYPE_ALBUMS) {
            return this.albumData;
          } else {
            return this.songData;
          }
        } else {
          // default values for computations on server-side, to prevent high load on server
          return []
        }
      },
      songData() {
        return ranking(
          this.rawData.filter(item => item.points > 0),
          this.sortAscending ? (item => item.points) : (item => -item.points),
          item => item.song.title,
        )
      },
      artistData() {
        const primaryScores = _.groupBy(this.rawData, item => item.song.artistId)
        const secondaryScores = _.groupBy(
          this.rawData.filter(item => item.song.secondArtistId),
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
          this.sortAscending ? (item => item.points) : (item => -item.points),
          item => item.artist.name,
        )
      },
      albumData() {
        const data = _.values(_.groupBy(this.rawData, item => item.song.albumId)).map(items => {
          const aggregateFunction = sumSongsScoreMethods.has(this.scoreMethod) ? _.sum : _.head;
          return {
            album: _.first(items).song.album,
            artist: _.first(items).song.artist,
            key: _.first(items).song.album.id,
            points: aggregateFunction(items.map(item => item.points))
          }
        });

        return ranking(
          data.filter(item => item.points > 0),
          this.sortAscending ? (item => item.points) : (item => -item.points),
          item => item.album.title,
        )
      },
      scoreMethodOptions() {
        const items = [
          {value: SCORE_ENTRY_COUNT, title: "Aantal noteringen"}
        ]
        if (this.type !== 'nummers') {
          items.push({value: SCORE_SONG_COUNT, title: "Aantal verschillende nummers"})
        }

        items.push({value: SCORE_BORDA, title: "Borda count (positie 1 = 100, positie 2 = 99, enz.)"})

        if (this.type !== 'artiesten') {
          items.push({value: SCORE_YEAR_ASC, title: "Jaar van release (stijgend)"})
          items.push({value: SCORE_YEAR_DESC, title: "Jaar van release (dalend)"})
        }

        return items
      }
    },
    watch: {
      queryParams(newQueryParams, oldQueryParams) {
        if (JSON.stringify(newQueryParams) !== JSON.stringify(oldQueryParams)) {
          useRouter().replace({
            query: newQueryParams
          });
        }
      },
      query(newQuery) {
        this.type = parseType(newQuery.type);
        this.filter = parseFilter(newQuery.filter);
        this.cutoff = parseCutoff(newQuery.cutoff);
        this.startYear = newQuery.start ? newQuery.start : _.first(useRootStore().years)?.yyyy;
        this.endYear = newQuery.einde ? newQuery.einde : useRootStore().lastCompleteYear?.yyyy;
        this.scoreMethod = parseScoreMethod(newQuery.score, this.type);
        this.countryFilter = newQuery.land;
        this.languageFilter = newQuery.taal;
        this.leadVocalsFilter = newQuery.leadVocals;
        this.minReleaseYear = parseInt(newQuery.minReleaseYear);
        this.maxReleaseYear = parseInt(newQuery.maxReleaseYear);
      }
    },
    mounted() {
      this.isMounted = true
      if (!this.maxReleaseYear) {
        this.maxReleaseYear = this.highestReleaseYear
      }
      if (!this.minReleaseYear) {
        this.minReleaseYear = this.lowestReleaseYear
      }
    },
    methods: {
      updateReleaseYearRange(newValue) {
        const [minValue, maxValue] = newValue
        this.minReleaseYear = minValue
        this.maxReleaseYear = maxValue
      },
      applyFilters(songs) {
        const selectedYears = this.selectedYears;
        let result = songs;

        if (this.filter === FILTER_ALL_YEARS) {
          result = result.filter(song =>
              selectedYears.every(year => song.position(year, this.extended))
          );
        } else if (this.filter === FILTER_NO_EXIT) {
          result = result.filter(song =>
              selectedYears.slice(1).every(year =>
                  !song.position(year.previous, this.extended) || !!song.position(year, this.extended)
              )
          );
        } else if (this.filter === FILTER_ANY) {
          result = result.filter(song =>
              selectedYears.some(year => song.position(year, this.extended))
          );
        }

        if (this.countryFilter) {
          result = result.filter(song => song.artist.countryId === this.countryFilter);
        }
        if (this.languageFilter) {
          result = result.filter(song => song.languageId === this.languageFilter);
        }
        if (this.leadVocalsFilter) {
          result = result.filter(song => song.leadVocals === this.leadVocalsFilter);
        }
        if (this.minReleaseYear) {
          result = result.filter(song => song.album.releaseYear >= this.minReleaseYear);
        }
        if (this.maxReleaseYear) {
          result = result.filter(song => song.album.releaseYear <= this.maxReleaseYear);
        }

        return result;
      }
    }
  })
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
