<template>
  <iframe :src="`https://open.spotify.com/embed/track/${spotifyId}`" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
</template>

<script>
  export default {
    name: 'Spotify',
    props: ['spotifyId']
  }
</script>
