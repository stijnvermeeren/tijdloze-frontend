<template lang="pug">
a(:href="href")
  v-btn(size="small" density="comfortable" :prepend-icon="mdiLink" rounded)
    slot
</template>

<script setup lang="ts">
import { mdiLink } from '@mdi/js'

defineProps<{
  href: string
}>()
</script>
