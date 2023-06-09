<template lang="pug">
span
  artist-link(:artist="song.artist")
  template(v-if='song.secondArtist')
    |
    | en
    |
    artist-link(:artist='song.secondArtist')
</template>

<script>
  import Song from "../orm/Song";

  export default {
    props: {
      song: Song
    }
  }
</script>
