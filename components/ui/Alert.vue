<template lang="pug">
v-alert.mb-5(
  :title="title"
  variant="tonal"
  :icon="mdiInformationVariantCircleOutline"
  density="compact"
  color="#888"
)
  slot
</template>

<script setup>
import { mdiInformationVariantCircleOutline } from '@mdi/js'

defineProps({
  icon: Object,
  title: String
})
</script>

<style scoped lang="scss">
:deep(.v-alert-title) {
  font-size: 1rem;
  font-weight: bold;
}

.v-alert {
  grid-template-areas:
    "prepend content append close"
    "prepend content . .";
  font-size: 13px;
}

:deep(.v-alert__prepend) {
  align-self: center;
}
</style>