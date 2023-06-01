<template lang="pug">
Title {{year.yyyy}}
div
  h2 De Tijdloze van {{year.yyyy}}
  client-only(placeholder="Loading...")
    full-list(:songs='songsExtended' :year='year')

  el-card(v-if='year.previous()')
    template(#header)
      div.header
        div.title {{songs.length && songs[0].position(year) === 1 ? "Hoogtepunten" : "Voorlopige hoogtepunten"}}
    table.list-summary
      tbody
        tr
          th Hoogste nieuwkomer
          td
            span(v-if='highestNew')
              song-link(:song='highestNew')
              |
              | -
              |
              song-artist-link(:song='highestNew')
              |
              | (
              position(:song='highestNew' :year='year')
              | )
              span(v-if='highestNew.isReEntry(years, year)')
                |
                | (re-entry)
            span(v-else) /
        tr
          th Grootste stijger
          td
            span(v-if='biggestUp') #[song-link(:song='biggestUp')] - #[song-artist-link(:song='biggestUp')] (#[position(:song='biggestUp' :year='year.previous()')] &rarr; #[position(:song='biggestUp' :year='year')])
            span(v-else) /
        tr
          th Grootste daler
          td
            span(v-if='biggestDown') #[song-link(:song='biggestDown')] - #[song-artist-link(:song='biggestDown')] (#[position(:song='biggestDown' :year='year.previous()')] &rarr; #[position(:song='biggestDown' :year='year')])
            span(v-else) /

  div(id="exits")

  el-card(v-if='exits.length')
    template(#header)
      div.header
        div.title Exits
    table.lijst.perVijf
      tbody
        tr
          th.r
            | {{year.previous().yyyy}}
          th.a Artiest
          th Titel
          th.releaseYear
            | Jaar
        tr(v-for='song in exits')
          td.r
            position(:song='song' :year='year.previous()')
          td.a
            song-artist-link(:song='song')
          td
            song-link(:song='song')
          td.releaseYear
            | {{song.album.releaseYear}}

  el-card(v-if='newSongs.length')
    template(#header)
      div.header
        div.title Nieuwkomers
    table.lijst.perVijf
      tbody
        tr
          th.r
            | {{year.yyyy}}
          th.a Artiest
          th Titel
          th
          th.releaseYear
            | Jaar
        tr(v-for='song in newSongs')
          td.r
            position(:song='song' :year='year')
          td.a
            song-artist-link(:song='song')
          td
            song-link(:song='song')
          td
            span(v-if='song.isReEntry(years, year)') Re-entry
          td.releaseYear
            | {{song.album.releaseYear}}

  el-card(v-if='analysis')
    template(#header)
      div.header
        div.title Interessante feiten
    .analysis
      div(v-for='text in analysis')
        make-links(:text='text')
</template>

<script>
  import _ from 'lodash';
  import analyse from '~/utils/analyse';
  import FullList from '../../components/FullList'
  import {useRootStore} from "~/stores/root";

  export default defineNuxtComponent({
    computed: {
      years() {
        return useRootStore().years;
      },
      year() {
        return this.years.find(year => year.yyyy.toString() === useRoute().params.yyyy);
      },
      songs() {
        return useRootStore().listTop100(this.year);
      },
      songsExtended() {
        return useRootStore().list(this.year);
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
            useRootStore().listTop100(this.year.previous()).filter(song => {
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
          if (this.year.yyyy === useRootStore().currentYear?.yyyy && this.analysisCurrentYear) {
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
    async asyncData() {
      const yyyyParam = useRoute().params.yyyy
      if (yyyyParam === useRootStore().currentYear.yyyy.toString()) {
        const {data: analysisCurrentYearResponse} = await useApiFetch(`text/analysis_${yyyyParam}`);
        return {
          analysisCurrentYear: analysisCurrentYearResponse?.value ?? ''
        }
      }
    },
    validate() {
      return useRootStore().years.find(year => year.yyyy.toString() === useRoute().params.yyyy);
    }
  })
</script>

<style lang="scss" scoped>
  div.analysis {
    font-size: 14px;

    div {
      padding-bottom: 6px;
      margin-bottom: 6px;
      border-bottom: 1px dotted #ddd;
    }
  }

  .releaseYear {
    @media (max-width: 660px) {
      display: none;
    }
  }

</style>
