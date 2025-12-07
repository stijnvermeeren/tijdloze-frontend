<template lang="pug">
span.container
  UserAvatar(x
    :id="user.id"
    :user-name="user.displayName"
    :is-admin="user.isAdmin"
  )
  v-menu(v-if="isAdmin")
    template(v-slot:activator="{ props }")
      v-btn.adminButton(:icon="mdiChevronDown" v-bind="props" size="small" density="compact" variant="plain")
    v-sheet
      div Volledige ID: {{user.id}}
      div(v-if='isAdmin && user.id !== currentUser.id && !user.isAdmin')
        div(v-if='!isBlocked')
          v-btn(@click='block()' :disabled='blocking' density="compact") Blokkeren
        template(v-else)
          div Gebruiker geblokkeerd!
          div 
            v-btn(@click='unblock()' :disabled='blocking' density="compact") Opnieuw toelaten
</template>

<script setup>
import { mdiChevronDown } from "@mdi/js";
import {useAuthStore} from "~/stores/auth";

const { isAdmin, user: currentUser } = storeToRefs(useAuthStore())

const {$api} = useNuxtApp()

const props = defineProps({
  user: Object
})

const blocking = ref(false)
const isBlocked = ref(!!props.user.isBlocked)

async function block() {
  blocking.value = true;
  await $api(`/user/${props.user.id}/block`, useFetchOptsPost());
  isBlocked.value = true;
  blocking.value = false;
}
async function unblock() {
  blocking.value = true;
  await $api(`/user/${props.user.id}/block`, useFetchOptsDelete());
  isBlocked.value = false;
  blocking.value = false;
}
watch(() => props.user, () => {
  isBlocked.value = !!props.user.isBlocked;
})
</script>

<style lang="scss" scoped>
  @use "../../assets/styleConfig";

  span.container {
    .adminButton {
      color: #888;
    }
  }
</style>
