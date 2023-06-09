<template lang="pug">
Title Op komst
div
  h2 Op komst in de Tijdloze van {{year.yyyy}}?
  #toelichting(style='margin-bottom: 1.5em;')
    p
      | De nummers die we dit jaar nog niet gehoord hebben, gesorteerd volgens hun positie in de lijst van vorig jaar.
  table.lijst.perVijf
    tbody
      tr
        th.n
          nuxt-link(:to='`/lijst/${year.previous().previous().yyyy}`')
            | {{year.previous().previous()._yy}}
        th.r
          nuxt-link(:to='`/lijst/${year.previous().yyyy}`')
            | {{year.previous()._yy}}
        th.a Artiest
        th Nummer
      tr(v-for='song in upcomingSongs')
        td.n
          position(:song='song' :year='year.previous().previous()')
        td.r
          position-change(:song='song' :year='year.previous()')
          position(:song='song' :year='year.previous()')
        td.a
          song-artist-link(:song='song')
        td
          song-link(:song='song')
</template>

<script>
  import _ from 'lodash';
  import {useRootStore} from "~/stores/root";

  export default {
    computed: {
      year() {
        return useRootStore().currentYear;
      },
      upcomingSongs() {
        const previousYear = useRootStore().listTop100(this.year.previous())
        return _.reverse(
          previousYear.filter(song => !song.position(this.year) && song.probablyInList(this.year))
        );
      }
    }
  }
</script>

<style scoped>

</style>
