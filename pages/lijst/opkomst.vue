<template lang="pug">
Title Op komst
div
  h2 Op komst in de Tijdloze van {{year.yyyy}}?
  p.mb-5
    | De nummers die we dit jaar nog niet gehoord hebben, gesorteerd volgens hun positie in de lijst van vorig jaar.
  ui-card
    template(#title) Tijdloze van {{year.previous.yyyy}}
    div
      song-with-position(
        v-for='entry in upcomingSongs'
        :song='entry.song'
        :attribution="entry.attribution"
        :year='year.previous'
      )
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
        const previousYear = useRootStore().list(this.year.previous).filter(entry => entry.position <= 100)
        return _.reverse(
          previousYear.filter(entry => !entry.song.position(this.year) && entry.song.probablyInList(this.year))
        );
      }
    }
  }
</script>

<style scoped>

</style>
