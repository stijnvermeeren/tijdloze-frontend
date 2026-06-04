<template lang="pug">
div(v-if="isAdmin")
  nuxt-link(:to="to")
    v-btn(color="warning" variant="tonal" rounded size="small")
      slot
</template>

<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";

defineProps<{
  to: string
}>()

const isAdmin = computed(() => {
  return useAuthStore().isAdmin
})
</script>
