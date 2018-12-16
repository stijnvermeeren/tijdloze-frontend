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
