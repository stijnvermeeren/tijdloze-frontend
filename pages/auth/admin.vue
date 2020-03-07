<template lang="pug">
  p Signing in
</template>

<script>
  export default {
    computed: {
      user() {
        return this.$store.state.auth.user;
      }
    },
    watch: {
      user() {
        if (this.user) {
          if (this.user.isAdmin) {
            const redirect = this.$route.query['redirect']
            this.$router.replace(redirect ? redirect : '/');
          } else {
            this.$router.replace('/');
          }
        }
      }
    },
    mounted () {
      this.$auth.loginSilently()
    }
  }
</script>
