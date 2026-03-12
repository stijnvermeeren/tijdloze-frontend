<template lang="pug">
v-btn(@click='click' color="amber" :icon="mdiDelete" :disabled='disabled' size="small")
</template>

<script setup lang="ts">
import {mdiDelete} from "@mdi/js";

defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits(['click'])

function click() {
  emit('click');
}
</script>

<style scoped>
.v-btn {
  float: right;
}
</style>