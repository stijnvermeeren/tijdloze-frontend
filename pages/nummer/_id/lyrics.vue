<template>
  <div>
    <p class="lyrics">
      {{ fullSongData.lyrics }}
    </p>
  </div>
</template>

<script>
  export default {
    props: ['fullSongData']
  }
</script>

<style scoped>
    p.lyrics {
        white-space: pre-line;
        font-style: italic;
    }
</style>
