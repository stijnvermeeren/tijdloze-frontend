<template lang="pug">
  div
    h2 Volledige database
    el-alert.alert(title="Database downloaden" :closable="false" show-icon)
      | Zie #[nuxt-link(to='/website/opendata') open data] voor mogelijkheden om de hele database the downloaden.
    div
      el-select(v-model="filter" size="small")
        el-option(value="alle" label="In minstens een")
        el-option(value="alle_jaren" label="In elke")
        el-option(value="geen_exit" label="Niet weggevallen uit de")
      |
      el-select(v-model="cutoff" size="small")
        el-option(value="top100" label="top 100")
        el-option(value="full" label="volledige lijst")
      |
      | van
      |
      el-select.selectYear(v-model='startYear' size="small")
        el-option(v-for='year in years' :key='year.yyyy' :value='year.yyyy')
      |
      | tot en met
      |
      el-select.selectYear(v-model='endYear' size="small")
        el-option(v-for='year in years' :key='year.yyyy' :value='year.yyyy')
    div
      | Filter:
      |
      country-filter(v-model='countryFilter')
      language-filter(v-model='languageFilter')
      lead-vocals-filter(v-model='leadVocalsFilter')
    div
      | Jaar van release van
      |
      el-input-number(
        v-model='minReleaseYear'
        :min="lowestReleaseYear"
        :max="highestReleaseYear"
        size="small"
        controls-position="right"
        @focus="setDefaultMinReleaseYear"
      )
      |
      | tot en met
      |
      el-input-number(
        v-model='maxReleaseYear'
        :min="lowestReleaseYear"
        :max="highestReleaseYear"
        size="small"
        controls-position="right"
        @focus="setDefaultMaxReleaseYear"
      )

    el-alert.alert(v-if="showWarning" :title="`Tijdloze van ${currentYear.yyyy} nog onvolledig`" type="warning" :closable="false" show-icon)
      | De statistieken kunnen nog veranderen.

    div.list
      client-only(placeholder="Loading...")
        div.entry.header
          div.r
          div.c
            el-radio-group(v-model="type" size="small")
              el-radio-button(label='nummers') Nummers
              el-radio-button(label='artiesten') Artiesten
              el-radio-button(label='albums') Albums
          div.p
            el-select(v-model="scoreMethod" size="small")
              el-option(value="entry_count" label="Aantal noteringen")
              el-option(v-if="type !== 'nummers'" value="song_count" label="Aantal verschillende nummers")
              el-option(value="borda" label="Borda count (positie 1 = 100, positie 2 = 99, enz.)")
              el-option(v-if="type !== 'artiesten'" value="year_asc" label="Jaar van release (stijgend)")
              el-option(v-if="type !== 'artiesten'" value="year_desc" label="Jaar van release (dalend)")
        div.content
          div.wrapper
            RecycleScroller.scroller(:items="data" :item-size="24" key-field="key" :buffer="40")
              template(v-slot="{ item, index }")
                div.entry(:class="{lineBelow: index % 5 === 4}")
                  div.r
                    | {{ item.position }}
                  div.c
                    div.a(v-if="type === 'nummers'")
                      tijdloze-song-artist(:song='item.entry.song')
                    div.a(v-else)
                      tijdloze-artist(:artist='item.entry.artist')
                    div(v-if="type === 'nummers'")
                      tijdloze-song(:song='item.entry.song')
                    div(v-if="type === 'albums'")
                      tijdloze-album(:album='item.entry.album')
                  div.p {{ Math.round(item.entry.points * 10) / 10 }}
</template>

<script>
  import _ from 'lodash'

  import ranking from '../store/ranking';
  import Artist from "@/orm/Artist";
  import CountryFilter from "@/components/CountryFilter";
  import LanguageFilter from "@/components/LanguageFilter";
  import LeadVocalsFilter from "@/components/LeadVocalsFilter";
  import Album from "../orm/Album";

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

  function parseFilter(value) {
    return validFilters.has(value) ? value : FILTER_ANY
  }

  const CUTOFF_TOP100 = 'top100'
  const CUTOFF_FULL = 'full'
  const validCutoffs = new Set([CUTOFF_TOP100, CUTOFF_FULL])

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

  export default {
    components: {CountryFilter, LanguageFilter, LeadVocalsFilter },
    data() {
      const type = parseType(this.$route.query.type)
      return {
        isMounted: false,
        type,
        filter: parseFilter(this.$route.query.filter),
        cutoff: parseCutoff(this.$route.query.cutoff),
        startYear: this.$route.query.start ? this.$route.query.start : _.first(this.$store.getters.years).yyyy,
        endYear: this.$route.query.einde ? this.$route.query.einde : this.$store.getters.lastCompleteYear.yyyy,
        minReleaseYear: undefined,
        maxReleaseYear: undefined,
        scoreMethod: parseScoreMethod(this.$route.query.score, type),
        countryFilter: this.$route.query.land,
        languageFilter: this.$route.query.taal,
        leadVocalsFilter: this.$route.query.leadVocals
      }
    },
    computed: {
      lowestReleaseYear() {
        return _.min(Album.all().map(album => album.releaseYear))
      },
      highestReleaseYear() {
        return _.max(Album.all().map(album => album.releaseYear))
      },
      queryParams() {
        const allParams = {
          type: this.type,
          start: this.startYear.toString(),
          einde: this.endYear.toString(),
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
        return this.$route.query;
      },
      extended() {
        return this.cutoff === CUTOFF_FULL;
      },
      selectedSongs() {
        return this.applyFilters(this.$store.getters.songs);
      },
      years() {
        return this.$store.getters.years;
      },
      currentYear() {
        return this.$store.getters.currentYear;
      },
      selectedYears() {
        return this.years.filter(year => year.yyyy >= this.startYear && year.yyyy <= this.endYear);
      },
      showWarning() {
        return this.$store.getters.listInProgress && this.endYear >= this.currentYear.yyyy
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

        const data = Artist.all().map(artist => {
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
      }
    },
    watch: {
      queryParams(newQueryParams, oldQueryParams) {
        if (JSON.stringify(newQueryParams) !== JSON.stringify(oldQueryParams)) {
          this.$router.replace({
            query: newQueryParams
          });
        }
      },
      query(newQuery) {
        this.type = parseType(newQuery.type);
        this.filter = parseFilter(newQuery.filter);
        this.cutoff = parseCutoff(newQuery.cutoff);
        this.startYear = newQuery.start ? newQuery.start : _.first(this.$store.getters.years).yyyy;
        this.endYear = newQuery.einde ? newQuery.einde : this.$store.getters.lastCompleteYear.yyyy;
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
    },
    methods: {
      setDefaultMinReleaseYear() {
        if (!this.minReleaseYear) {
          this.minReleaseYear = this.lowestReleaseYear
        }
      },
      setDefaultMaxReleaseYear() {
        if (!this.maxReleaseYear) {
          this.maxReleaseYear = this.highestReleaseYear
        }
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
                  !song.position(year.previous(), this.extended) || !!song.position(year, this.extended)
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
    },
    head: {
      title: 'Volledige database'
    },
    ssrComputedCache: true
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
        align-items: center;
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

  .selectYear {
    width: 100px;
  }

  div.noot {
    font-size: 85%;
    margin-left: 2em;
  }

  div#toelichting {
    margin-bottom: 2em;
  }

  table.lijst {
    margin-top: 2em;
  }

  .alert {
    margin-top: 10px;
    margin-bottom: 15px;
  }
</style>
