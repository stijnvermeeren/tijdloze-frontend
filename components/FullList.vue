<template lang="pug">
ui-card
  template(#title) De lijst
  div.fullList(v-if='songs.length > 0')
    div.content(v-if='songs.length > 20')
      div.wrapper
        RecycleScroller.scroller(:items="songs" :item-size="60" key-field="id" :buffer="40")
          template(#default="{item}")
            full-list-entry(:song="item" :year="year")
    div(v-else)
      full-list-entry(v-for="song in songs" :key="song.id" :song="song" :year="year")

  p(v-else) Nog geen nummers in de Tijdloze van {{year.yyyy}}.
</template>

<script setup>
import Year from "../orm/Year";

defineProps({
  year: {
    type: Year
  },
  songs: {
    type: Array
  }
})
</script>

<style lang="scss">
  div.content {
    flex: 100% 1 1;
    position: relative;
    height: 400px;

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
