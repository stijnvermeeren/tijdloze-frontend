<template lang="pug">
  div
    h2 De Tijdloze van {{year.yyyy}}
    full-list(:songs='songsExtended' :year='year')

    div(v-if='year.previous()')
      h3 {{songs.length && songs[0].position(year) === 1 ? "Hoogtepunten" : "Voorlopige hoogtepunten"}}
      table.list-summary
        tbody
          tr
            th Hoogste nieuwkomer
            td
              span(v-if='highestNew')
                tijdloze-song(:song='highestNew')
                |
                | -
                |
                tijdloze-song-artist(:song='highestNew')
                |
                | (
                tijdloze-position(:song='highestNew' :year='year')
                | )
                span(v-if='highestNew.isReEntry($store.getters.years, year)')
                  |
                  | (re-entry)
              span(v-else) /
          tr
            th Grootste stijger
            td
              span(v-if='biggestUp') #[tijdloze-song(:song='biggestUp')] - #[tijdloze-song-artist(:song='biggestUp')] (#[tijdloze-position(:song='biggestUp' :year='year.previous()')] &rarr; #[tijdloze-position(:song='biggestUp' :year='year')])
              span(v-else) /
          tr
            th Grootste daler
            td
              span(v-if='biggestDown') #[tijdloze-song(:song='biggestDown')] - #[tijdloze-song-artist(:song='biggestDown')] (#[tijdloze-position(:song='biggestDown' :year='year.previous()')] &rarr; #[tijdloze-position(:song='biggestDown' :year='year')])
              span(v-else) /

    div(id="exits")

    div(v-if='exits.length')
      h3 Exits
      table.lijst.perVijf
        tbody
          tr
            th.r
              | {{year.previous().yyyy}}
            th.a
              nuxt-link(to='/artiesten') Artiest
            th
              nuxt-link(to='/nummers') Titel
            th.releaseYear
              | Jaar
          tr(v-for='song in exits')
            td.r
              tijdloze-position(:song='song' :year='year.previous()')
            td.a
              tijdloze-song-artist(:song='song')
            td
              tijdloze-song(:song='song')
            td.releaseYear
              | {{song.album.releaseYear}}

    div(v-if='newSongs.length')
      h3 Nieuwkomers
      table.lijst.perVijf
        tbody
          tr
            th.r
              | {{year.yyyy}}
            th.a
              nuxt-link(to='/artiesten') Artiest
            th
              nuxt-link(to='/nummers') Titel
            th
            th.releaseYear
              | Jaar
          tr(v-for='song in newSongs')
            td.r
              tijdloze-position(:song='song' :year='year')
            td.a
              tijdloze-song-artist(:song='song')
            td
              tijdloze-song(:song='song')
            td
              span(v-if='song.isReEntry($store.getters.years, year)') Re-entry
            td.releaseYear
              | {{song.album.releaseYear}}

    div(v-if='analysis')
      h3 Interessante feiten
      .analysis
        ul
          li(v-for='text in analysis')
            tijdloze-links(:text='text')
</template>

<script>
  import _ from 'lodash';
  import analyse from '../../store/analyse';
  import FullList from '../../components/FullList'

  export default {
    components: {FullList},
    computed: {
      years() {
        return this.$store.getters.years;
      },
      year() {
        return this.years.find(year => year.yyyy.toString() === this.$route.params.yyyy);
      },
      songs() {
        return this.$store.getters.list(this.year);
      },
      songsExtended() {
        const extendedSongs = this.$store.getters.list(this.year, true);
        const extendedPositions = extendedSongs.map(song => song.position(this.year, true))
        if (Math.max(...extendedPositions) - Math.min(...extendedPositions) === extendedSongs.length - 1) {
          // don't show extended list if there are gaps
          return extendedSongs;
        } else {
          return this.songs;
        }
      },
      newSongs() {
        if (this.year.previous()) {
          return this.songs.filter(song => !song.position(this.year.previous()));
        } else {
          return [];
        }
      },
      exits() {
        if (this.year.previous()) {
          return _.sortBy(
            this.$store.getters.list(this.year.previous()).filter(song => {
              return song.notInList(this.year);
            }),
            song => song.position(this.year.previous())
          );
        } else {
          return [];
        }
      },
      analysis() {
        const item = analyse.find(item => item.yyyy === this.year.yyyy);
        if (item) {
          return item.analyse;
        } else {
          if (this.year.yyyy === this.$store.getters.currentYear.yyyy && this.analysisCurrentYear) {
            return this.analysisCurrentYear.split(/\r?\n/);
          } else {
            return null;
          }
        }
      },
      highestNew() {
        return _.first(this.newSongs);
      },
      biggestUp() {
        return _.last(
          _.sortBy(
            this.songs.filter(song => {
              return song.position(this.year.previous()) && song.position(this.year) < song.position(this.year.previous());
            }),
            [song => song.position(this.year.previous()) - song.position(this.year), song => -song.position(this.year)]
          )
        );
      },
      biggestDown() {
        return _.last(
          _.sortBy(
            this.songs.filter(song => {
              return song.position(this.year.previous()) && song.position(this.year) > song.position(this.year.previous());
            }),
            [song => song.position(this.year) - song.position(this.year.previous()), song => -song.position(this.year)]
          )
        );
      }
    },
    async asyncData({ params, app, store }) {
      if (params.yyyy === store.getters.currentYear.yyyy.toString()) {
        const analysisCurrentYearResponse = await app.$axios.$get(`text/analysis_${params.yyyy}`);
        return {
          analysisCurrentYear: analysisCurrentYearResponse ? analysisCurrentYearResponse.value : ''
        }
      }
    },
    head() {
      return {
        title: this.year.yyyy
      }
    },
    validate({params, store}) {
      return store.getters.years.find(year => year.yyyy.toString() === params.yyyy);
    }
  }
</script>

<style lang="scss" scoped>
  div.analysis {
    font-size: 14px;
  }

  .releaseYear {
    @media (max-width: 660px) {
      display: none;
    }
  }

</style>
