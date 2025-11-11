<template lang="pug">
div.d-flex.align-center
  div.icon
    v-icon(:icon="mdiArrowRightBottom")
  slot
</template>

<script setup>
import {mdiArrowRightBottom} from "@mdi/js";
</script>

<style lang="scss" scoped>
.icon {
  width: 4em;
  text-align: center;
}
</style>