<template lang="pug">
div(v-if="href")
  a(:href="href") {{ value }}
div(v-else) {{ value }}
div.iframecontainer(v-if="iFrameSrc")
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
    case "wikidataId":
      return `https://wikidata.org/wiki/${props.value}`
    case "countryId":
      return undefined
    default:
      return props.value
  }
})

const iFrameSrc = computed(() => {
  switch (props.field) {
    case "spotifyId":
      return `https://open.spotify.com/embed/artist/${props.value}`
    case "urlAllMusic":
      return undefined
    default:
      return href.value
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