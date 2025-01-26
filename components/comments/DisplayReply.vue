<template lang="pug">
div.d-flex.align-center
  div.icon
    v-icon(:icon="mdiArrowRightBottom")
  comments-display.flex-grow-1(:comment="comment" @deleted="() => emit('deleted')")
</template>

<script setup>
import {mdiArrowRightBottom} from "@mdi/js";

const emit = defineEmits(['deleted'])

const props = defineProps({
  comment: Object
})
</script>

<style lang="scss" scoped>
.icon {
  width: 4em;
  text-align: center;
}
</style>
