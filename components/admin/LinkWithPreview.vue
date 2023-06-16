<template lang="pug">
div {{ value }}
div.iframecontainer
  iframe(
    :src="iFrameSrc"
    frameBorder="0"
    allowfullscreen=""
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
  )
</template>

<script setup>
const props = defineProps({
  field: String,
  value: String
})

const href = computed(() => {
  switch (props.field) {
    case "spotifyId":
      return `https://open.spotify.com/artist/${props.value}`
    default:
      return undefined
  }
})

const iFrameSrc = computed(() => {
  switch (props.field) {
    case "spotifyId":
      return `https://open.spotify.com/embed/artist/${props.value}`
    default:
      return undefined
  }
})
</script>

<style lang="scss" scoped>
.iframecontainer {
  border-radius: 12px;
  background-color: #eee;
}

iframe {
  width: 100%;
  height: 152px;
  border-radius: 12px;
}
</style>