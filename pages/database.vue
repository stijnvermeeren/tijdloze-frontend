<template lang="pug">
  div
    h2 Volledige database
    el-alert.alert(title="Database downloaden" :closable="false" show-icon)
      | Zie #[nuxt-link(to='/website/opendata') open data] voor mogelijkheden om de hele database the downloaden.
    div
      | Filter:
      |
      country-filter(v-model='countryFilter')
      language-filter(v-model='languageFilter')
      lead-vocals-filter(v-model='leadVocalsFilter')
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
        el-option(v-for='year in completedYears' :key='year.yyyy' :value='year.yyyy')
      |
      | tot en met
      |
      el-select.selectYear(v-model='endYear' size="small")
        el-option(v-for='year in completedYears' :key='year.yyyy' :value='year.yyyy')

    table.lijst.perVijf
      tbody
        tr
          th.r
          th(:colspan="type === 'artiesten' ? 1 : 2")
            el-radio-group(v-model="type" size="small")
              el-radio-button(label='nummers') Nummers
              el-radio-button(label='artiesten') Artiesten
              el-radio-button(label='albums') Albums
          th
            el-select(v-model="scoreMethod" size="small")
              el-option(value="entry_count" label="Aantal noteringen")
              el-option(value="borda" label="Borda count (positie 1 = 100, positie 2 = 99, enz.)")
              el-option(v-if="type !== 'artiesten'" value="year_asc" label="Jaar van release (stijgend)")
              el-option(v-if="type !== 'artiesten'" value="year_desc" label="Jaar van release (dalend)")
        tr(v-for='{entry, position} in data' :key='entry.key')
          td.r
            | {{ position }}
          td.a(v-if="type === 'nummers'")
            tijdloze-song-artist(:song='entry.song')
          td(v-else :class="{'a': type === 'albums', 'l': type === 'artiesten'}")
            tijdloze-artist(:artist='entry.artist')
          td(v-if="type === 'nummers'")
            tijdloze-song(:song='entry.song')
          td(v-if="type === 'albums'")
            tijdloze-album(:album='entry.album')
          td {{ Math.round(entry.points * 10) / 10 }}
</template>

<script>
  import _ from 'lodash'

  import ranking from '../store/ranking';
  import Artist from "@/orm/Artist";
  import CountryFilter from "@/components/CountryFilter";
  import LanguageFilter from "@/components/LanguageFilter";
  import LeadVocalsFilter from "@/components/LeadVocalsFilter";

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
  const SCORE_BORDA = 'borda'
  const SCORE_YEAR_ASC = 'year_asc'
  const SCORE_YEAR_DESC = 'year_desc'
  const validScoreMethods = {}
  validScoreMethods[TYPE_SONGS] = [SCORE_ENTRY_COUNT, SCORE_BORDA, SCORE_YEAR_ASC, SCORE_YEAR_DESC];
  validScoreMethods[TYPE_ALBUMS] = [SCORE_ENTRY_COUNT, SCORE_BORDA, SCORE_YEAR_ASC, SCORE_YEAR_DESC];
  validScoreMethods[TYPE_ARTISTS] = [SCORE_ENTRY_COUNT, SCORE_BORDA];
  const summableScoreMethods = new Set([SCORE_ENTRY_COUNT, SCORE_BORDA])

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
        type,
        filter: parseFilter(this.$route.query.filter),
        cutoff: parseCutoff(this.$route.query.cutoff),
        startYear: this.$route.query.start ? this.$route.query.start : _.first(this.$store.getters.completedYears).yyyy,
        endYear: this.$route.query.einde ? this.$route.query.einde : _.last(this.$store.getters.completedYears).yyyy,
        scoreMethod: parseScoreMethod(this.$route.query.score, type),
        countryFilter: this.$route.query.land || "",
        languageFilter: this.$route.query.taal || "",
        leadVocalsFilter: this.$route.query.leadVocals || ""
      }
    },
    computed: {
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
          leadVocals: this.leadVocalsFilter
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
        return this.filterSong(this.filterArtist(this.filterYears(this.$store.getters.songs)));
      },
      completedYears() {
        return this.$store.getters.completedYears;
      },
      selectedYears() {
        return this.completedYears.filter(year => year.yyyy >= this.startYear && year.yyyy <= this.endYear);
      },
      sortAscending() {
        return this.scoreMethod === SCORE_YEAR_ASC
      },
      songScoreFn() {
        if (summableScoreMethods.has(this.scoreMethod)) {
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
        if (this.type === TYPE_ARTISTS) {
          return this.artistData;
        } else if (this.type === TYPE_ALBUMS) {
          return this.albumData;
        } else {
          return this.songData;
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
          const aggregateFunction = summableScoreMethods.has(this.scoreMethod) ? _.sum : _.head;
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
        this.startYear = newQuery.start ? newQuery.start : _.first(this.$store.getters.completedYears).yyyy;
        this.endYear = newQuery.einde ? newQuery.einde : _.last(this.$store.getters.completedYears).yyyy;
        this.scoreMethod = parseScoreMethod(newQuery.score, this.type);
        this.countryFilter = newQuery.land ? newQuery.land : "";
        this.languageFilter = newQuery.taal ? newQuery.taal : "";
        this.leadVocalsFilter = newQuery.leadVocals ? newQuery.leadVocals : "";
      }
    },
    methods: {
      filterYears(songs) {
        const selectedYears = this.selectedYears;
        if (this.filter === FILTER_ALL_YEARS) {
          return songs.filter(song =>
            selectedYears.every(year => song.position(year, this.extended))
          );
        } if (this.filter === FILTER_NO_EXIT) {
          return songs.filter(song =>
            selectedYears.slice(1).every(year =>
              !song.position(year.previous(), this.extended) || !!song.position(year, this.extended)
            )
          );
        } else {
          return songs.filter(song =>
            selectedYears.some(year => song.position(year, this.extended))
          );
        }
      },
      filterArtist(songs) {
        if (this.countryFilter) {
          return songs.filter(song => song.artist.countryId === this.countryFilter);
        } else {
          return songs;
        }
      },
      filterSong(songs) {
        let result = songs;
        if (this.languageFilter) {
          result = result.filter(song => song.languageId === this.languageFilter);
        }
        if (this.leadVocalsFilter) {
          result = result.filter(song => song.leadVocals === this.leadVocalsFilter);
        }

        return result;
      }
    },
    head: {
      title: 'De Tijdloze Tijdloze'
    }
  }
</script>

<style lang="scss" scoped>
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
    margin-bottom: 15px;
  }
</style>
