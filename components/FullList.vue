<template lang="pug">
div
  v-text-field(
    v-model="filterQuery"
    label="Zoeken in de lijst"
    persistent-placeholder
    hide-details
    clearable
    density="compact"
  )
    template(#prepend-inner)
      v-icon(:icon="mdiMagnify")
div.fullList(v-if='filteredSongs.length > 0')
  div.content(v-if='filteredSongs.length > 20')
    div.wrapper
      RecycleScroller.scroller(:items="filteredSongs" :item-size="60" key-field="id" :buffer="40")
        template(#default="{item}")
          song-with-position(:song="item" :year="year")
  div(v-else)
    full-list-entry(v-for="song in filteredSongs" :key="song.id" :song="song" :year="year")

p(v-else) Nog geen nummers in de Tijdloze van {{year.yyyy}}.
</template>

<script setup>
import Year from "../orm/Year";
import {mdiMagnify} from "@mdi/js";

const props = defineProps({
  year: {
    type: Year
  },
  songs: {
    type: Array
  }
})

const filterQuery = ref("")

const filteredSongs = computed(() => {
  const queryFragments = useSearchQueryFragments(filterQuery.value)
  return useSearchFilter(queryFragments, props.songs, useSearchSongContent)
})
</script>

<style lang="scss">
div.content {
  flex: 100% 1 1;
  position: relative;
  height: 560px;

  .wrapper {
    overflow: hidden;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    .scroller {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
