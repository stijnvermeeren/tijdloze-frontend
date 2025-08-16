<template lang="pug">
nuxt-link(:to='`/artiest/${artist.id}-${artist.slug}`') {{content}}
</template>

<script setup>
const props = defineProps({
  artist: Object,
  text: String
})

const content = computed(() => {
  return props.text ? props.text : props.artist.name;
})
</script>
