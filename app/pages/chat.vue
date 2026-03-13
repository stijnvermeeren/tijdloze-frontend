<template lang="pug">
Title Chatbox
div
  h2 De Tijdloze chatbox
  template(v-if='chatEnabled || skipSettingsCheck')
    div(v-if='isAuthenticated')
      div(v-if='displayName')
        chat
        ui-alert.mt-4
          div Hou het spannend voor iedereen alsjeblieft. Wie in de chat informatie lekt over noteringen in de Tijdloze die nog niet op de radio zijn uitgezonden, kan onmiddellijk en zonder waarschuwing geblokkeerd worden.
      div(v-else)
        .displayName
          div
            | Kies een gebruikersnaam:
            v-text-field(:disabled='submittingDisplayName' type='text' v-model='name' @keypress.enter='submitDisplayName()' hide-details)
            v-btn(:disabled='submittingDisplayName || invalidDisplayName' @click='submitDisplayName()')
              | Naar de chatbox
    div(v-else)
      | Om toegang te krijgen tot de chatbox moet je je #[nuxt-link(:to="{path: '/auth/login', query: {redirect: route.fullPath}}") aanmelden/registeren].
  template(v-else)
    div Sorry, de chatbox is (nog) niet toegankelijk op dit moment. Probeer later nog eens.
</template>

<script setup lang="ts">
import type { TextValueResponse } from '~/api/contracts'
import { apiEndpoints } from '~/api/endpoints'
import { queryKeys } from '~/api/queryKeys'
import {useAuthStore} from "~/stores/auth";
const {$api} = useNuxtApp()

const name = ref<string>(useAuthStore().displayName ?? '')
const submittingDisplayName = ref(false)

const {data: chatEnabled} = await useApiFetch(
  apiEndpoints.text.chatOn(),
  { transform: (data: TextValueResponse) => data.value === 'on', key: queryKeys.text.chatOn }
)

const route = computed(() => {
  return useRoute()
})
const isAuthenticated = computed(() => {
  return useAuthStore().isAuthenticated;
})
const displayName = computed(() => {
  return useAuthStore().displayName;
})
const invalidDisplayName = computed(() => {
  return !name.value || name.value.length === 0;
})
const skipSettingsCheck = computed(() => {
  return 'skipSettingsCheck' in useRoute().query
})

async function submitDisplayName() {
  submittingDisplayName.value = true;

  const data = {
    displayName: name.value
  };
  const user = await $api(apiEndpoints.user.displayName(), data)
  submittingDisplayName.value = false;
  useAuthStore().user = user;
}
</script>

<style scoped>
    div.displayName {
      padding: 0.3em 4em;
      margin: 1em 0;

      input {
        width: 150px;
      }

      div.info {
        font-size: 90%;
        font-style: italic;
      }
    }

  div.note {
    font-size: 14px;
    margin: 10px 0;
  }
</style>
