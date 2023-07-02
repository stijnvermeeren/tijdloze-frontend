<template lang="pug">
ui-card
  template(#title)
    v-tabs.mb-4
      v-tab(v-for='tab in tabs' :key='tab.to' :to="tab.to")
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
</style>