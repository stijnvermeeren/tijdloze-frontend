<template lang="pug">
Title Admin: Instellingen
div
  h2 Instellingen
  div
    v-switch(v-model="commentsOn" :true-value="'on'" :false-value="'off'" label="Reacties open" hide-details)
  div
    v-switch(v-model="chatOn" :true-value="'on'" :false-value="'off'" label="Chatbox open" hide-details)
  p
    v-btn(@click="invalidateCache") Invalidate API caches
</template>

<script setup lang="ts">
import type { TextValueResponse } from '~/api/contracts'
import { apiEndpoints } from '~/api/endpoints'
const {$api} = useNuxtApp()

definePageMeta({
  middleware: 'admin'
})

const {data: chatOn} = await useApiFetch(
  apiEndpoints.text.chatOn(),
  { transform: (response: TextValueResponse) => response.value }
);
const {data: commentsOn} = await useApiFetch(
  apiEndpoints.text.commentsOn(),
  { transform: (response: TextValueResponse) => response.value }
);

watch(chatOn, async () => {
  await $api(apiEndpoints.text.updateByKey('chatOn'), { text: chatOn.value });
})

watch(commentsOn, async () => {
  await $api(apiEndpoints.text.updateByKey('commentsOn'), { text: commentsOn.value });
})

async function invalidateCache() {
  await $api(apiEndpoints.cache.invalidate());
}
</script>

<style scoped>

</style>
