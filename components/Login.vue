<template>
    <div>
        <button v-if="isAuthenticated" @click="logout()">
            Log Out
        </button>
        <button v-else @click="login()">
            Log In
        </button>
    </div>
</template>

<script>
  import { unsetToken, login } from '~/utils/auth';

  export default {
    computed: {
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      }
    },
    methods: {
      login() {
        login();
      },
      logout() {
        unsetToken();
        this.$store.commit('setUser', null);
        this.$router.push("/");
      }
    }
  }
</script>
