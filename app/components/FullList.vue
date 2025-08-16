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
div.fullList(v-if='filteredList.length > 0')
  div.content(v-if='filteredList.length > 20')
    div.wrapper
      RecycleScroller.scroller(:items="filteredList" :item-size="60" key-field="position" :buffer="40")
        template(#default="{item}")
          song-with-position(:song="item.song" :attribution="item.attribution" :override-position="item.position" :year="year")
  div(v-else)
    song-with-position(
      v-for="entry in filteredList"
      :key="entry.position"
      :song="entry.song"
      :attribution="entry.attribution"
      :override-position="entry.position"
      :year="year"
    )

p(v-else)
  template(v-if="filterQuery") Geen passende nummers gevonden in de Tijdloze van {{year.yyyy}}.
  template(v-else="filterQuery") Nog geen nummers in de Tijdloze van {{year.yyyy}}.
</template>

<script setup>
import Year from "../orm/Year";
import {mdiMagnify} from "@mdi/js";

const props = defineProps({
  year: {
    type: Year
  },
  list: {
    type: Array
  }
})

const filterQuery = ref("")

const filteredList = computed(() => {
  const queryFragments = useSearchQueryFragments(filterQuery.value)
  return props.list.filter(entry => useSearchFilter(queryFragments, useSearchSongContent)(entry.song))
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
