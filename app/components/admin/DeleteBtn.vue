<template lang="pug">
v-btn(@click='click' color="amber" :icon="mdiDelete" :disabled='disabled' size="small")
</template>

<script setup>
import {mdiDelete} from "@mdi/js";

defineProps({
  disabled: Boolean
})

const emit = defineEmits(['click'])

function click() {
  emit('click');
}
</script>

<style lang="scss" scoped>
.v-btn {
  float: right;
}
</style>