<template lang="pug">
  div
    h2 Alle Tijdloze nummers
    table.lijst.perVijf
      tbody
        tr
          th.l Nummer
          th.l
            nuxt-link(to='/artiesten') Artiest
          th Jaar
        tr(v-for='song in songs' :key='song.id')
          td.l
            tijdloze-song(:song='song')
          td.l
            tijdloze-song-artist(:song='song')
          td
            | {{song.album.releaseYear}}
</template>

<script>
  export default {
    computed: {
      songs() {
        return this.$store.getters.songs;
      }
    },
    head: {
      title: 'Nummers'
    }
  }
</script>
