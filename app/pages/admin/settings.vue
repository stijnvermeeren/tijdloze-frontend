<template lang="pug">
Title Admin: Instellingen
div
  h2 Instellingen
  div
    v-switch(
      v-model="commentsOnEdit"
      :true-value="'on'"
      :false-value="'off'"
      label="Reacties open"
      hide-details
    )
  div
    v-switch(
      v-model="chatOnEdit"
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
import { textKey } from '~/api/endpoints/text'
const {$api} = useNuxtApp()

definePageMeta({
  middleware: 'admin'
})

const {data: chatOnResponse} = await useApiFetch(apiEndpoints.text.byKey(textKey.chatOn))
const {data: commentsOnResponse} = await useApiFetch(apiEndpoints.text.byKey(textKey.commentsOn))

const chatOn = computed(() => chatOnResponse.value?.value ?? 'off')
const commentsOn = computed(() => commentsOnResponse.value?.value ?? 'off')

const chatOnEdit = ref<string>(chatOn.value)
const commentsOnEdit = ref<string>(commentsOn.value)

watch(chatOnEdit, (newValue) => {
  $api(apiEndpoints.text.updateByKey(textKey.chatOn), { text: newValue })
})

watch(commentsOnEdit, (newValue) => {
  $api(apiEndpoints.text.updateByKey(textKey.commentsOn), { text: newValue })
})

async function invalidateCache() {
  await $api(apiEndpoints.cache.invalidate());
}
</script>

<style scoped>

</style>
