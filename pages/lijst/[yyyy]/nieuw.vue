<template lang="pug">
table.lijst.perVijf
  tbody
    tr
      th.r
        | {{year.yyyy}}
      th.a Artiest
      th Titel
      th
      th.releaseYear
        | Jaar
    tr(v-for='song in newSongs')
      td.r
        position(:song='song' :year='year')
      td.a
        song-artist-link(:song='song')
      td
        song-link(:song='song')
      td
        span(v-if='song.isReEntry(year)') Re-entry
      td.releaseYear
        | {{song.album.releaseYear}}
</template>

<script setup>
const props = defineProps({
  newSongs: Array,
  year: Object
})
</script>