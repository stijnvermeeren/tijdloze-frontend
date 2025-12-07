<template lang="pug">
#login
  div(v-if='isAuthenticated')
    div.label Aangemeld als 
    div
      user-avatar(:id="user.id" :user-name="userName" :is-admin="isAdmin")
    v-btn.mt-2(rounded @click='logout()' size="small") Afmelden
  div(v-else)
    v-btn(rounded :to="{path: '/auth/login', query: {redirect: route.fullPath}}") Aanmelden
</template>

<script setup>
  import {useAuthStore} from "~/stores/auth";
  import {useAuth0} from "@auth0/auth0-vue";

  let auth0

  const route = useRoute()

  const {isAuthenticated, displayNameWithFallback: userName, isAdmin, user } = storeToRefs(useAuthStore())

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

    .label {
      font-size: 12px;
      color: #444;
    }
  }
</style>
