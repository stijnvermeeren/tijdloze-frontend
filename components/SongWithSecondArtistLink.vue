<template lang="pug">
  span
    song-link(:song="song")
    template(v-if="song.secondArtist")
      |
      | (met
      |
      artist-link(:artist="song.secondArtist")
      | )
</template>

<script>
  import SongLink from "./SongLink";
  import ArtistLink from "./ArtistLink";

  export default {
    components: {ArtistLink, SongLink},
    props: ["song"]
  }
</script>

<style lang="less" scoped>
</style>
