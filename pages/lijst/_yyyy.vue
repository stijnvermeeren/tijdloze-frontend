<template lang="pug">
  div
    h2 De Tijdloze van {{year.yyyy}}
    full-list(:songs='songsExtended' :year='year')

    div(v-if='year.previous()')
      h3 {{songs.length &gt;= 100 ? "Hoogtepunten" : "Voorlopige hoogtepunten"}}
      table.list-summary
        tbody
          tr
            th Hoogste nieuwkomer
            td
              span(v-if='highestNew')
                | #[tijdloze-song(:song='highestNew')] - #[tijdloze-artist(:artist='highestNew.artist')] (#[tijdloze-position(:song='highestNew' :year='year')])
                span(v-if='highestNew.isReEntry($store.getters.years, year)') (re-entry)
              span(v-else='') /
          tr
            th Grootste stijger
            td
              span(v-if='biggestUp') #[tijdloze-song(:song='biggestUp')] - #[tijdloze-artist(:artist='biggestUp.artist')] (#[tijdloze-position(:song='biggestUp' :year='year.previous()')] &rarr; #[tijdloze-position(:song='biggestUp' :year='year')])
              span(v-else='') /
          tr
            th Grootste daler
            td
              span(v-if='biggestDown') #[tijdloze-song(:song='biggestDown')] - #[tijdloze-artist(:artist='biggestDown.artist')] (#[tijdloze-position(:song='biggestDown' :year='year.previous()')] &rarr; #[tijdloze-position(:song='biggestDown' :year='year')])
              span(v-else='') /

    div(v-if='exits.length')
      h3 Exits
      table.lijst.perVijf
        tbody
          tr
            th.r
              | {{year.previous()._yy}}
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
              tijdloze-artist(:artist='song.artist')
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
              | {{year._yy}}
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
              tijdloze-artist(:artist='song.artist')
            td
              tijdloze-song(:song='song')
            td
              span(v-if='song.isReEntry($store.getters.years, year)') Re-entry
            td.releaseYear
              | {{song.album.releaseYear}}

    div(v-if='analyse')
      h3 Interessante feiten
      .analyse
        ul
          li(v-for='text in analyse')
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
        return this.$store.getters.list(this.year, true);
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
            this.$store.getters.songs.filter(song => {
              return song.position(this.year.previous()) && song.notInList(this.year);
            }),
            song => song.position(this.year.previous())
          );
        } else {
          return [];
        }
      },
      analyse() {
        const item = analyse.find(item => item.yyyy === this.year.yyyy);
        if (item) {
          return item.analyse;
        } else {
          if (this.year.yyyy === 2018) {
            return this.analyse2018.split(/\r?\n/);
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
    async asyncData({ params, app }) {
      if (params.yyyy === '2018') {
        const analyse2018 = await app.$axios.$get('text/analyse2018');
        return {
          analyse2018: analyse2018 ? analyse2018.value : ''
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

<style lang="less" scoped>
  div.analyse {
    font-size: 14px;
  }

  .releaseYear {
    @media (max-width: 660px) {
      display: none;
    }
  }

</style>
