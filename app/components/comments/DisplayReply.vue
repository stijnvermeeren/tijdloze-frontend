<template lang="pug">
div.container
  div.icon
    v-icon(:icon="mdiArrowRightBottom")
  div.content
    slot
</template>

<script setup>
import {mdiArrowRightBottom} from "@mdi/js";
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: 48px 1fr;
  grid-template-rows: auto;
  grid-template-areas: "icon content";

  .icon {
    text-align: center;
    grid-area: icon;
    margin-top: 5px;
  }

  .content {
    grid-area: content;
  }
}


</style>