<template lang="pug">
div.annotation
  span(:class="type")
    slot
</template>

<script setup>
const props = defineProps({
  type: String
})
</script>

<style lang="scss" scoped>
div.annotation {
  font-size: 80%;

  span.up {
    color: #007700;
  }
  span.down {
    color: #aa0000;
  }
  span.equal {
    color: #777;
  }
}
</style>
