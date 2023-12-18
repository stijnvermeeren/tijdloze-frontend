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
        div.buttons
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
.v-card {
  z-index: auto; // avoiding a new "stacking context" for the v-card, so that search results can overflow correctly
}

.cardTitle {
  display: flex;
  justify-content: space-between;
}

.buttons {
  text-align: center;
}
</style>
