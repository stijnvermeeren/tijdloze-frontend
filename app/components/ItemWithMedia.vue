<template lang="pug">
.itemWithMedia
  div
    slot(name="media")
  div
    div.title
      slot(name="title")
    div.subtitle(v-if="$slots.subtitle")
      slot(name="subtitle")
    div.extra(v-if="$slots.extra")
      slot(name="extra")
</template>

<script setup lang="ts">
defineSlots<{
  media(): void
  title(): void
  subtitle?(): void
  extra?(): void
}>()
</script>

<style scoped>
.itemWithMedia {
  display: flex;
  height: 64px;
  align-items: center;

  > div {
    padding: 1px 7px;
  }

  .title {
    font-weight: bold;
  }

  .subtitle {
    font-size: 85%;
    color: #777;
  }

  .extra {
    font-size: 85%;
    color: #777;
    font-style: italic;
  }
}
</style>
