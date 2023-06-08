<template lang="pug">
div(v-if="isAdmin")
  nuxt-link(:to="to")
    v-btn(color="warning" variant="tonal" rounded size="small")
      slot
</template>

<script setup>
import {useAuthStore} from "~/stores/auth";

defineProps({
  to: String
})

const isAdmin = useAuthStore().isAdmin
</script>
