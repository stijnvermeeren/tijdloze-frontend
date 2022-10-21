<template lang="pug">
  div
    h2 Explore
    table
      tbody
        tr
          th Vergelijk:
          td
            select(v-model='type')
              option(value='nummers')
                | Nummers
              option(value='artiesten')
                | Artiesten
              option(value='albums')
                | Albums
        tr
          th In...
          td
            select(v-model='filter')
              option(value="alle")
                | minstens een
              option(value="alle_jaren")
                | elke
              option(value="geen_exit")
                | niet weggevallen uit de
            |
            | top 100 van
            |
            select.selectYear(v-model='startYear')
              option(v-for='year in completedYears' :key='year.yyyy' :value='year.yyyy')
                | {{ year.yyyy }}
            |
            | tot en met
            |
            select.selectYear(v-model='endYear')
              option(v-for='year in completedYears' :key='year.yyyy' :value='year.yyyy')
                | {{ year.yyyy }}
        tr
          th Filter:
          td
            div
              | Nationaliteit van artiest:
              |
              country-filter(v-model='countryFilter')
        tr
          th Sorteren:
          td
            div
              input.ra(v-model='method' type='radio' value='1')
              |  Borda count
            div
              input.ra(v-model='method' type='radio' value='2')
              |  Realistische telling
        tr(v-if='!active')
          th
          td
            button(@click='submit()' type='submit')
              | Bereken Tijdloze Tijdloze

    table.lijst.perVijf(v-if="active && type === 'nummers'")
      tbody
        tr
          th.r
          th.a
            nuxt-link(to='/artiesten')
              | Artiest
          th
            nuxt-link(to='/nummers')
              | Nummer
          th Score
        tr(v-for='{entry, position} in songData' :key='entry.song.id')
          td.r
            | {{ position }}
          td.a
            tijdloze-song-artist(:song='entry.song')
          td
            tijdloze-song(:song='entry.song')
          td {{ Math.round(entry.points * 10) / 10 }}

    table.lijst.perVijf(v-if="active && type === 'artiesten'")
      tbody
        tr
          th.r
          th.l
            nuxt-link(to='/artiesten')
              | Artiest
          th Score
        tr(v-for='{entry, position} in artistData' :key='entry.artist.id')
          td.r
            | {{ position }}
          td.l
            tijdloze-artist(:artist='entry.artist')
          td {{ Math.round(entry.points * 10) / 10 }}

    table.lijst.perVijf(v-if="active && type === 'albums'")
      tbody
        tr
          th.r
          th.a
            nuxt-link(to='/artiesten')
              | Artiest
          th Album
          th Score
        tr(v-for='{entry, position} in albumData' :key='entry.album.id')
          td.r
            | {{ position }}
          td.a
            tijdloze-artist(:artist='entry.artist')
          td
            tijdloze-album(:album='entry.album')
          td {{ Math.round(entry.points * 10) / 10 }}
</template>

<script>
  import _ from 'lodash';
  import ranking from '../store/ranking';
  import Artist from "@/orm/Artist";
  import CountryFilter from "@/components/CountryFilter";

  const FILTER_ANY = 'alle'
  const FILTER_NO_EXIT = 'geen_exit'
  const FILTER_ALL_YEARS = 'alle_jaren'

  export default {
    components: { CountryFilter },
    data() {
      const isStrict = this.$route.query.strikt ? this.$route.query.strikt === "1" : false;
      let filter = FILTER_ANY;
      if (this.$route.query.filter === FILTER_NO_EXIT) {
        filter = FILTER_NO_EXIT;
      } else if (isStrict || this.$route.query.filter === FILTER_ALL_YEARS) {
        filter = FILTER_ALL_YEARS;
      }

      return {
        active: !!this.$route.query.type,
        type: this.$route.query.type ? this.$route.query.type : "nummers",
        filter: filter,
        startYear: this.$route.query.start ? this.$route.query.start : _.first(this.$store.getters.completedYears).yyyy,
        endYear: this.$route.query.einde ? this.$route.query.einde : _.last(this.$store.getters.completedYears).yyyy,
        method: this.$route.query.telling ? this.$route.query.telling : "1",
        countryFilter: this.$route.query.land || ""
      }
    },
    computed: {
      queryParams() {
        let filter = FILTER_ANY;
        if (this.filter === FILTER_NO_EXIT) {
          filter = FILTER_NO_EXIT;
        } else if (this.filter === FILTER_ALL_YEARS) {
          filter = FILTER_ALL_YEARS;
        }

        return {
          type: this.type,
          start: this.startYear.toString(),
          einde: this.endYear.toString(),
          filter: filter,
          telling: this.method,
          land: this.countryFilter
        };
      },
      query() {
        return this.$route.query;
      },
      selectedSongs() {
        return this.filterArtist(this.filterYears(this.$store.getters.songs));
      },
      completedYears() {
        return this.$store.getters.completedYears;
      },
      selectedYears() {
        return this.completedYears.filter(year => year.yyyy >= this.startYear && year.yyyy <= this.endYear);
      },
      scoreFn() {
        if (this.method === '1') {
          return position => 101 - position;
        } else {
          return position => 400 / (position + 5);
        }
      },
      rawData() {
        const selectedYears = this.selectedYears;
        const scoreFn = this.scoreFn;
        return this.selectedSongs.map(song => {
          return {
            song: song,
            points: _.sum(
              selectedYears
                .map(year => song.position(year))
                .filter(position => position)
                .map(scoreFn)
            )
          }
        });
      },
      songData() {
        return ranking(
          this.rawData.filter(item => item.points > 0),
          item => -item.points,
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
            points: score
          }
        }).filter(items => items.points > 0)

        return ranking(
          data.filter(item => item.points > 0),
          item => -item.points,
          item => item.artist.name,
        )
      },
      albumData() {
        const data = _.values(_.groupBy(this.rawData, item => item.song.albumId)).map(items => {
          return {
            album: _.first(items).song.album,
            artist: _.first(items).song.artist,
            points: _.sum(items.map(item => item.points))
          }
        });

        return ranking(
          data.filter(item => item.points > 0),
          item => -item.points,
          item => item.album.title,
        )
      }
    },
    watch: {
      queryParams(newQueryParams) {
        if (this.active) {
          this.$router.replace({
            query: newQueryParams
          });
        }
      },
      query(newQuery) {
        if (newQuery.type) {
          let filter = FILTER_ANY;
          if (this.$route.query.filter === FILTER_NO_EXIT) {
            filter = FILTER_NO_EXIT;
          } else if (this.$route.query.filter === FILTER_ALL_YEARS) {
            filter = FILTER_ALL_YEARS;
          }

          this.active = true;
          this.type = newQuery.type ? newQuery.type : "nummers";
          this.filter = filter;
          this.startYear = newQuery.start ? newQuery.start : _.first(this.$store.getters.completedYears).yyyy;
          this.endYear = newQuery.einde ? newQuery.einde : _.last(this.$store.getters.completedYears).yyyy;
          this.method = newQuery.telling ? newQuery.telling : "1";
          this.countryFilter = newQuery.land ? newQuery.land : "";
        } else {
          this.active = false;
        }
      }
    },
    methods: {
      filterYears(songs) {
        const selectedYears = this.selectedYears;
        if (this.filter === FILTER_ALL_YEARS) {
          return songs.filter(song =>
              selectedYears.every(year => song.position(year))
          );
        } if (this.filter === FILTER_NO_EXIT) {
          return songs.filter(song =>
              selectedYears.slice(1).every(year =>
                  !song.position(year.previous()) || !!song.position(year)
              )
          );
        } else {
          return songs;
        }
      },
      filterArtist(songs) {
        if (this.countryFilter) {
          return songs.filter(song => song.artist.countryId === this.countryFilter);
        } else {
          return songs;
        }
      },
      submit() {
        this.active = true;
        this.$router.push({
          query: this.queryParams
        });
      },
    },
    head: {
      title: 'De Tijdloze Tijdloze'
    }
  }
</script>

<style lang="less" scoped>
  select {
    width: auto;
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
</style>
