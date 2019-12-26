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
  export default {
    props: ["song"]
  }
</script>
