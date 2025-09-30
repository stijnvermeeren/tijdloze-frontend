<template lang="pug">
ui-card
  v-tabs.mb-6(show-arrows)
    v-tab(v-for='tab in tabs' :key='tab.to' :to="tab.to" exact)
      div {{tab.title}}
      div.subtitle(v-if="tab.subtitle") ({{tab.subtitle}})
  slot
</template>

<script setup>
defineProps({
  tabs: Array
})
</script>

<style lang="scss" scoped>
:deep(.v-btn) {
  font-weight: bold;
}

:deep(.v-btn__content) {
  flex-direction: column;
}

.subtitle {
  font-weight: normal;
  font-size: 80%;
}

:deep(.v-tab__slider) {
  opacity: 0.25;
  height: 1px;
}
:deep(.v-tab--selected .v-tab__slider) {
  opacity: 1;
  height: 2px;
}
</style>