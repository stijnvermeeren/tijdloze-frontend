<template lang="pug">
span
  tijdloze-artist(:artist="song.artist")
  template(v-if='song.secondArtist')
    |
    | en
    |
    tijdloze-artist(:artist='song.secondArtist')
</template>

<script>
  import Song from "../orm/Song";

  export default {
    props: {
      song: Song
    }
  }
</script>
