<template lang="pug">
  iframe(
    :src="`https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator`"
    width="500"
    height="80"
    frameBorder="0"
    allowfullscreen=""
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
  )
</template>

<script>
  export default {
    name: 'Spotify',
    props: ['spotifyId']
  }
</script>

<style lang="scss" scoped>
  iframe {
    border-radius: 12px;
  }
</style>