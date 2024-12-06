<template lang="pug">
#login
  div(v-if='isAuthenticated')
    div Aangemeld als {{userName}}
    v-btn(rounded @click='logout()' size="small") Afmelden
  div(v-else)
    v-btn(rounded to="/auth/login") Aanmelden
</template>

<script setup>
  import {useAuthStore} from "~/stores/auth";
  import {useAuth0} from "@auth0/auth0-vue";

  let auth0

  const isAuthenticated = computed(() => {
    return useAuthStore().isAuthenticated;
  })
  const userName = computed(() => {
    return useAuthStore().displayNameWithFallback;
  })

  onMounted(() => {
    auth0 = useAuth0()
  })

  function logout() {
    if (auth0) {
      auth0.logout();
    }
  }
</script>

<style lang="scss" scoped>
  #login {
    margin-top: 30px;
    text-align: center;
    font-size: 14px;
  }
</style>
