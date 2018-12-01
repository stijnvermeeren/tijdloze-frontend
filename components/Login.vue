<template>
    <div>
        <div v-if="isAuthenticated">
            Aangemeld als {{userName}}
            <button v-if="isAuthenticated" @click="logout()">
                Log Out
            </button>
        </div>
        <button v-else @click="login()">
            Log In
        </button>
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
