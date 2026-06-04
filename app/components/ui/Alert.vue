<template lang="pug">
v-alert.mb-5(
  :title="title"
  variant="tonal"
  :icon="icon"
  :color="color"
  density="compact"
)
  slot
</template>

<script setup lang="ts">
import { mdiInformationVariantCircleOutline, mdiSailBoatSink, mdiAlertOutline, mdiBalloon } from '@mdi/js'

const props = defineProps<{
  title?: string
  type?: 'error' | 'warning' | 'success'
}>()

let icon = mdiInformationVariantCircleOutline
let color = 'grey-darken-1'

switch(props.type) {
  case "error":
    icon = mdiSailBoatSink
    color = 'red'
    break
  case "warning":
    icon = mdiAlertOutline
    color = 'amber'
    break
  case "success":
    icon = mdiBalloon
    color = 'green'
    break
}

</script>

<style scoped>
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