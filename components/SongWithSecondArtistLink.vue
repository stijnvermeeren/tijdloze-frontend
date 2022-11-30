<template lang="pug">
  span
    song-link(:song="song")
    template(v-if="secondArtist")
      |
      | (met
      |
      artist-link(:artist="secondArtist")
      | )
</template>

<script>
  import SongLink from "./SongLink";
  import ArtistLink from "./ArtistLink";
  import Song from "../orm/Song";
  import Artist from "../orm/Artist";

  export default {
    components: {ArtistLink, SongLink},
    props: {
      song: Song,
      artist: Artist
    },
    computed: {
      secondArtist() {
        if (this.artist && this.song.secondArtistId && this.artist.id === this.song.secondArtistId) {
          return this.song.artist
        } else {
          return this.song.secondArtist
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
