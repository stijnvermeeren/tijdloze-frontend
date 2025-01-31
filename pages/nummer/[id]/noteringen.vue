<template lang="pug">
  entry-count(:songs='[song]')
  .allPositions
    template(v-for='(interval, index) in intervals')
      div(v-if='index' :key="index")
        div ...
        div
      div(v-for='year in interval' :key='year.yyyy')
        div.year
          year-link(:year='year' short)
        div
          position-with-change(:song='song' :year='year')
</template>

<script setup>
import {allEntriesIntervals} from "~/utils/intervals";

const props = defineProps({
  song: Object
})

const {years} = storeToRefs(useYearStore())

const intervals = computed(() => {
  return allEntriesIntervals([props.song], years.value, true);
})

</script>

<style lang="scss" scoped>
div.allPositions {
  text-align: center;
  display: flex;
  flex-wrap: wrap;

  > div {
    margin: 12px 12px;
    min-width: 45px;
    display: flex;
    flex-direction: column;

    > div {

    }
  }
}
</style>
