<template lang="pug">
span
  | {{album.title}}
  span.suffix(v-if="album.isSingle || album.isSoundtrack")
    |  ({{suffix}})
</template>

<script setup>
const props = defineProps({
  album: Object
})

const suffix = computed(() => {
  const elements = []
  if (props.album.isSingle) {
    elements.push("single")
  }
  if (props.album.isSoundtrack) {
    elements.push("soundtrack")
  }
  return elements.join(", ")
})

</script>

<style lang="scss" scoped>
  .suffix {
    font-size: 90%;
  }
</style>
