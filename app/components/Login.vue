<template lang="pug">
#login
  div(v-if='isAuthenticated')
    div.label Aangemeld als 
    div
      user-avatar(v-if="userId" :id="userId" :user-name="userName" :is-admin="isAdmin")
    v-btn.mt-2(rounded @click='logout()' size="small") Afmelden
  div(v-else)
    v-btn(rounded :to="{path: '/auth/login', query: {redirect: route.fullPath}}") Aanmelden
</template>

<script setup lang="ts">
  import {useAuthStore} from "~/stores/auth";
  import {useAuth0} from "@auth0/auth0-vue";

  let auth0: ReturnType<typeof useAuth0> | null = null

  const route = useRoute()

  const {isAuthenticated, displayNameWithFallback, isAdmin, user } = storeToRefs(useAuthStore())
  const userId = computed(() => user.value?.id)
  const userName = computed(() => displayNameWithFallback.value ?? '')

  onMounted(() => {
    auth0 = useAuth0()
  })

  function logout() {
    if (auth0) {
      auth0.logout();
    }
  }
</script>

<style scoped>
  #login {
    margin-top: 30px;
    text-align: center;
    font-size: 14px;

    .label {
      font-size: 12px;
      color: #444;
    }
  }
</style>
