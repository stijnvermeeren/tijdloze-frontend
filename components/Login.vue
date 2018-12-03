<template>
    <div id="login">
        <div v-if="isAuthenticated">
            <div>Aangemeld als {{userName}}</div>
            <div v-if="isAuthenticated">
                <a @click="logout()">
                    Afmelden
                </a>
            </div>
        </div>
        <div v-else>
            <a @click="login()">
                Aanmelden
            </a>
        </div>
    </div>
</template>

<script>
  import { unsetAccessToken, login, logout } from '~/utils/auth';

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
        sessionStorage.setItem("redirectPath", this.$route.path);
        unsetAccessToken(this, this.$store);
        login();
      },
      logout() {
        this.$store.commit('setUser', null);
        unsetAccessToken(this, this.$store);
        logout();
      },
      test() {
        this.$axios.$post(`user`).then(result => {
          console.log(result);
        })
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
