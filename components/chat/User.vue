<template lang="pug">
span.container
  span(
    @click.ctrl='showInfo = !showInfo'
    @click.alt='showInfo = !showInfo'
    :class='{isAdmin: user.isAdmin}'
    ref="label"
  ) {{user.displayName}}
  .info(
    v-if='showInfo'
    :style="{ top: contextPosition.top, left: contextPosition.left }"
  )
    div Unieke ID: {{user.id}}
    div(v-if='user.isAdmin') Moderator
    div(v-if='currentUser.isAdmin && user.id !== currentUser.id && !user.isAdmin')
      div(v-if='!isBlocked')
        button(@click='block()' :disabled='blocking')
          | Blokkeren
      div(v-else)
        | Gebruiker geblokkeerd!
        button(@click='unblock()' :disabled='blocking')
          | Opnieuw toelaten
    div
      a(@click='showInfo = false') Sluiten
</template>

<script setup>
import {useAuthStore} from "~/stores/auth";

const {$api} = useNuxtApp()

const props = defineProps({
  user: Object
})

const showInfo = ref(false)
const blocking = ref(false)
const isBlocked = ref(!!props.user.isBlocked)
const contextPosition = ref({
  top: 0,
  left: 0
})

const label = useTemplateRef('label')

const currentUser = computed(() => {
  return useAuthStore().user;
})

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

watch(showInfo, () => {
  const boundingBox = label.value.getBoundingClientRect()
  contextPosition.value = {
    top: boundingBox.bottom,
    left: boundingBox.left + 20
  }
})
watch(() => props.user, () => {
  isBlocked.value = !!props.user.isBlocked;
})
</script>

<style lang="scss" scoped>
  @use "../../assets/styleConfig";

  span.container {

    div.info {
      position: absolute;
      background-color: styleConfig.$inputBackgroundColor;
      border: 1px solid gray;
      border-radius: 4px;
      padding: 1px 4px;
      z-index: 1;
      text-align: left;
      font-weight: normal;
      color: black;

      white-space: nowrap;
      font-size: 14px;

      div.close {
        text-align: right;
      }
    }
  }
</style>
