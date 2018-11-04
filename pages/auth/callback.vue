<template>
    <p>Signing in...</p>
</template>

<script>
  import { setAccessToken, checkSecret, getTokensFromHash } from '~/utils/auth'
  export default {
    mounted () {
      getTokensFromHash(({ idToken, accessToken }) => {
        setAccessToken(accessToken, this, this.$store);
        this.$router.replace('/')
      });
    }
  }
</script>
