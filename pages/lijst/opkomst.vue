<template lang="pug">
Title Op komst
div
  h2 Op komst in de Tijdloze van {{year.yyyy}}?
  p.mb-5
    | De nummers die we dit jaar nog niet gehoord hebben, gesorteerd volgens hun positie in de lijst van vorig jaar.
  ui-card
    template(#title) Tijdloze van {{year.previous.yyyy}}
    div
      full-list-entry(v-for='song in upcomingSongs' :song='song' :year='year.previous')
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
        const previousYear = useRootStore().listTop100(this.year.previous)
        return _.reverse(
          previousYear.filter(song => !song.position(this.year) && song.probablyInList(this.year))
        );
      }
    }
  }
</script>

<style scoped>

</style>
