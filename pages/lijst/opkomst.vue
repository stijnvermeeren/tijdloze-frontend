<template lang="pug">
Title Op komst
div
  h2 Op komst in de Tijdloze van {{currentYear.yyyy}}?
  p.mb-5
    | De nummers die we dit jaar nog niet gehoord hebben, gesorteerd volgens hun positie in de lijst van vorig jaar.
  ui-card
    template(#title) Tijdloze van {{previousYear.yyyy}}
    div
      song-with-position(
        v-for='entry in upcomingSongs'
        :song='entry.song'
        :attribution="entry.attribution"
        :year='previousYear'
      )
</template>

<script setup>
import _ from 'lodash';

const {previousYear, currentYear} = storeToRefs(useYearStore())

const upcomingSongs = computed(() => {
  const previousList = useRootStore().list(previousYear.value).filter(entry => entry.position <= 100)
  return _.reverse(
      previousList.filter(entry => !entry.song.position(currentYear.value) && entry.song.probablyInList(currentYear.value))
  );
})
</script>

<style scoped>

</style>
