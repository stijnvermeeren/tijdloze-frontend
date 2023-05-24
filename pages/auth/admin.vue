<template lang="pug">
p Signing in
</template>

<script>
  export default {
    data() {
      return {
        redirected: false
      }
    },
    computed: {
      user() {
        return this.$store.state.auth.user;
      }
    },
    watch: {
      user(newUser) {
        if (!this.redirected && newUser) {
          if (newUser.isAdmin) {
            const redirect = this.$route.query['redirect']
            this.$router.replace(redirect ? redirect : '/');
          } else {
            this.$router.replace('/');
          }
          this.redirected = true;
        }
      }
    },
    mounted () {
      this.$auth.loginSilently()
    }
  }
</script>
