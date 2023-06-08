<template lang="pug">
#login
  div(v-if='isAuthenticated')
    div Aangemeld als {{userName}}
    v-btn(rounded @click='logout()' size="small") Afmelden
  div(v-else)
    v-btn(rounded @click='login()') Aanmelden
</template>

<script>
  import {useAuthStore} from "~/stores/auth";
  import {useAuth0} from "@auth0/auth0-vue";

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
        this.$auth.login(useRoute().path);
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
