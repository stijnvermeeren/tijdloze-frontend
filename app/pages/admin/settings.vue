<template lang="pug">
Title Admin: Instellingen
div
  h2 Instellingen
  div
    v-switch(
      :model-value="commentsOn"
      @update:model-value="setCommentsOn($event ?? 'off')"
      :true-value="'on'"
      :false-value="'off'"
      label="Reacties open"
      hide-details
    )
  div
    v-switch(
      :model-value="chatOn"
      @update:model-value="setChatOn($event ?? 'off')"
      :true-value="'on'"
      :false-value="'off'"
      label="Chatbox open"
      hide-details
    )
  p
    v-btn(@click="invalidateCache") Invalidate API caches
</template>

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
const {$api} = useNuxtApp()

definePageMeta({
  middleware: 'admin'
})

const {data: chatOnResponse} = await useApiFetch(apiEndpoints.text.chatOn())
const {data: commentsOnResponse} = await useApiFetch(apiEndpoints.text.commentsOn())

const chatOn = computed(() => chatOnResponse.value?.value ?? 'off')

const commentsOn = computed(() => commentsOnResponse.value?.value ?? 'off')

function setChatOn(value: string): void { 
  $api(apiEndpoints.text.updateByKey('chatOn'), { text: value })
}

function setCommentsOn(value: string): void {
  $api(apiEndpoints.text.updateByKey('commentsOn'), { text: value })
}

async function invalidateCache() {
  await $api(apiEndpoints.cache.invalidate());
}
</script>

<style scoped>

</style>
