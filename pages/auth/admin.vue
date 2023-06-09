<template lang="pug">
p Signing in
</template>

<script>
  import {useAuthStore} from "~/stores/auth";

  export default {
    data() {
      return {
        redirected: false
      }
    },
    computed: {
      user() {
        return useAuthStore().user;
      }
    },
    watch: {
      user(newUser) {
        if (!this.redirected && newUser) {
          if (newUser.isAdmin) {
            const redirect = useRoute().query['redirect']
            useRouter().replace(redirect ? redirect : '/');
          } else {
            useRouter().replace('/');
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
