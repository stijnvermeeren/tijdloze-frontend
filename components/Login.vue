<template lang="pug">
#login
  div(v-if='isAuthenticated')
    div Aangemeld als {{userName}}
    el-button(round @click='logout()' size="small") Afmelden
  div(v-else)
    el-button(round @click='login()') Aanmelden
</template>

<script>
  import {useAuthStore} from "~/stores/auth";

  export default defineNuxtComponent({
    computed: {
      isAuthenticated() {
        return useAuthStore().isAuthenticated;
      },
      userName() {
        return useAuthStore().displayNameWithFallback;
      }
    },
    methods: {
      login() {
        this.$auth.login(this.$route.path);
      },
      logout() {
        useAuthStore().setUser( null);
        this.$auth.logout();
      }
    }
  })
</script>

<style lang="scss" scoped>
  #login {
    margin-top: 30px;
    text-align: center;
    font-size: 14px;
  }
</style>
