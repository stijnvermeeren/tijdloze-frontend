<template lang="pug">
div(v-if="href")
  a(:href="href" target="_blank") {{ value }}
div(v-else) {{ value }}
div.iframecontainer(v-if="iFrameSrc" :class="field")
  iframe(
    :src="iFrameSrc"
    :class="{isHidden: !showIFrame}"
    :onload="onload"
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

const showIFrame = ref(false)

const href = computed(() => {
  switch (props.field) {
    case "spotifyId":
      return `https://open.spotify.com/artist/${props.value}`
    case "wikidataId":
      return `https://wikidata.org/wiki/${props.value}`
    case "musicbrainzId":
      return `https://musicbrainz.org/artist/${props.value}`
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

watch(iFrameSrc, (newValue) => {
  showIFrame.value = false
})

function onload() {
  nextTick(() => {
    showIFrame.value = true
  })
}
</script>

<style lang="scss" scoped>
.iframecontainer {
  border-radius: 12px;
  background-color: #eee;

  iframe {
    width: 100%;
    height: 256px;
    border-radius: 12px;

    &.isHidden {
      height: 0;
    }
  }

  &.spotifyId iframe {
    height: 152px;
  }
}
</style>