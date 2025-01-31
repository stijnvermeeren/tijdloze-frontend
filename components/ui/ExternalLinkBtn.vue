<template lang="pug">
a(:href="href")
  v-btn(size="small" density="comfortable" :prepend-icon="mdiLink" rounded)
    slot
</template>

<script setup>
import { mdiLink } from '@mdi/js'

defineProps({
  href: String
})
</script>
