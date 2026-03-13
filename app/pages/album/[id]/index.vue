<template lang="pug">
in-current-list(:songs="album.songs")
</template>


<script setup lang="ts">
defineProps({
  album: {
    type: Object,
    required: true
  }
})

</script>