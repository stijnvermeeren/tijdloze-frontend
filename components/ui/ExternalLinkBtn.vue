<template lang="pug">
a(:href="href")
  v-btn(size="small" density="comfortable" rounded)
    v-icon.mr-2(:icon="mdiLink")
    span
      slot
</template>

<script setup>
import { mdiLink } from '@mdi/js'

defineProps({
  href: String
})
</script>
