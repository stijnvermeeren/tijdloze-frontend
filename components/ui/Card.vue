<template lang="pug">
v-card.my-5
  v-card-item
    div.cardTitle
      div
        v-card-title
          slot(name="title") {{title}}
        v-card-subtitle
          slot(name="subtitle") {{subtitle}}
      div
        div
          slot(name="buttons")
  v-card-text
    slot
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String
})
</script>

<style lang="scss" scoped>
.cardTitle {
  display: flex;
  justify-content: space-between;
}
</style>
