<template lang="pug">
ui-card
  template(#title)
    v-tabs.mb-4
      v-tab(v-for='tab in tabs' :key='tab.to' :to="tab.to") {{tab.title}}
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
</style>