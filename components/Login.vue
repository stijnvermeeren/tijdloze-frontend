<template>
    <div>
        <button v-if="isAuthenticated" @click="logout()">
            Log Out
        </button>
        <button v-else @click="login()">
            Log In
        </button>
        <button @click="test()">
            Test
        </button>
    </div>
</template>

<script>
  import { unsetAccessToken, login, logout } from '~/utils/auth';

  export default {
    computed: {
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      }
    },
    methods: {
      login() {
        unsetAccessToken(this, this.$store);
        login();
      },
      logout() {
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
