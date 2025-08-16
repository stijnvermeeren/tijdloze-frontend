<template lang="pug">
in-current-list(:songs='album.songs')
</template>


<script setup>
const props = defineProps({
  album: Object
})

</script>