<template lang="pug">
  iframe(
    :src='`https://open.spotify.com/embed/track/${spotifyId}`'
    width='300'
    height='80'
    frameborder='0'
    allowtransparency='true'
    allow='encrypted-media'
  )
</template>

<script>
  export default {
    name: 'Spotify',
    props: ['spotifyId']
  }
</script>
