<template lang="pug">
script-you-tube-player(
  :video-id='videoId'
  :width='width'
  :height='height'
  :root-attrs='rootAttrs'
)
  template(#error)
    div.youtube-player-error YouTube video kon niet worden geladen.
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  videoId: string
  width?: number
}>(), {
  width: 352
})

const height = computed(() => Math.round(props.width * 9 / 16))
const rootAttrs = computed(() => ({
  style: {
    width: `min(${props.width}px, 100%)`,
    maxWidth: '100%',
    aspectRatio: '16 / 9'
  }
}))
</script>

<style scoped>
.youtube-player-error {
  position: absolute;
  inset: 0;
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: white;
  text-align: center;
  background-color: black;
}

:deep(iframe) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
