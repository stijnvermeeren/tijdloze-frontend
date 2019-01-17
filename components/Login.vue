<template lang="pug">
  #login
    div(v-if='isAuthenticated')
      div Aangemeld als {{userName}}
      div
        a(@click='logout()') Afmelden
    div(v-else)
      a(@click='login()') Aanmelden
</template>

<script>
  export default {
    computed: {
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      },
      userName() {
        return this.$store.getters.displayNameWithFallback;
      }
    },
    methods: {
      login() {
        this.$auth.login(this.$route.path);
      },
      logout() {
        this.$store.commit('setUser', null);
        this.$auth.logout();
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../assets/styleConfig.less";

  #login {
    font-size: 80%;
  }
</style>
