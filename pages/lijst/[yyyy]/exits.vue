<template lang="pug">
table.lijst.perVijf
  tbody
    tr
      th.r
        | {{year.previous.yyyy}}
      th.a Artiest
      th Titel
      th.releaseYear
        | Jaar
    tr(v-for='song in exits')
      td.r
        position(:song='song' :year='year.previous')
      td.a
        song-artist-link(:song='song')
      td
        song-link(:song='song')
      td.releaseYear
        | {{song.album.releaseYear}}
</template>

<script setup>
const props = defineProps({
  exits: Array,
  year: Object
})
</script>