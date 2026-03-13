<template lang="pug">
span.container
  UserAvatar(
    :id="user.id"
    :user-name="user.displayName"
    :is-admin="user.isAdmin"
  )
  v-menu(v-if="isAdmin")
    template(v-slot:activator="{ props }")
      v-btn.adminButton(:icon="mdiChevronDown" v-bind="props" size="small" density="compact" variant="plain")
    v-sheet
      div Volledige ID: {{user.id}}
      div(v-if='isAdmin && currentUser && user.id !== currentUser.id && !user.isAdmin')
        div(v-if='!isBlocked')
          v-btn(@click='block()' :disabled='blocking' density="compact") Blokkeren
        template(v-else)
          div Gebruiker geblokkeerd!
          div 
            v-btn(@click='unblock()' :disabled='blocking' density="compact") Opnieuw toelaten
</template>

<script setup lang="ts">
import { mdiChevronDown } from "@mdi/js";
import type { ChatUser } from '~/api/contracts'
import { apiEndpoints } from '~/api/endpoints'
import {useAuthStore} from "~/stores/auth";

const { isAdmin, user: currentUser } = storeToRefs(useAuthStore())

const {$api} = useNuxtApp()

const props = defineProps<{
  user: ChatUser
}>()

const blocking = ref(false)
const isBlocked = ref(!!props.user.isBlocked)

async function block() {
  blocking.value = true;
  await $api(apiEndpoints.user.block(props.user.id));
  isBlocked.value = true;
  blocking.value = false;
}
async function unblock() {
  blocking.value = true;
  await $api(apiEndpoints.user.unblock(props.user.id));
  isBlocked.value = false;
  blocking.value = false;
}
watch(() => props.user, () => {
  isBlocked.value = !!props.user.isBlocked;
})
</script>

<style scoped>
  @import "../../assets/styleConfig.css";

  span.container {
    .adminButton {
      color: #888;
    }
  }
</style>
