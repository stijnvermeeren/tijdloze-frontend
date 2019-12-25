<template lang="pug">
  div
    h2 Op komst in de Tijdloze van {{year.yyyy}}?
    #toelichting(style='margin-bottom: 1.5em;')
      p
        | Welke nummers zijn nog op komst in de Tijdloze van dit jaar? De nummers zijn geordend volgens de posities van vorig jaar.
      p(v-if='!exitsKnown') Opgelet, de exits van dit jaar zijn nog niet bekend!
    table.lijst.perVijf
      tbody
        tr
          th.n
            nuxt-link(:to='`lijst/${year.previous().previous().yyyy}`')
              | {{year.previous().previous()._yy}}
          th.r
            nuxt-link(:to='`lijst/${year.previous().yyyy}`')
              | {{year.previous()._yy}}
          th.a
            nuxt-link(to='/artiesten') Artiest
          th
            nuxt-link(to='/nummers') Nummer
        tr(v-for='song in upcomingSongs')
          td.n
            tijdloze-position(:song='song' :year='year.previous().previous()')
          td.r
            tijdloze-position-change(:song='song' :year='year.previous()')
            tijdloze-position(:song='song' :year='year.previous()')
          td.a
            tijdloze-artist(:artist='song.artist')
          td
            tijdloze-song(:song='song')

</template>

<script>
  import _ from 'lodash';

  export default {
    computed: {
      year() {
        return this.$store.getters.currentYear;
      },
      exitsKnown() {
        return this.$store.state.exitSongIds.length;
      },
      upcomingSongs() {
        return _.sortBy(
          this.$store.getters.songs.filter(song => {
            return !song.exitCurrent && !song.position(this.year) && song.position(this.year.previous());
          }),
          song => -song.position(this.year.previous())
        );
      }
    }
  }
</script>

<style scoped>

</style>
