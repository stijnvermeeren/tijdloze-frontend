<template>
    <p>Signing in...</p>
</template>

<script>
  import { setAccessToken, getQueryParams, setAccessTokenCookie } from '~/utils/auth'
  export default {
    mounted () {
      // In the frontend, we assume that we get valid tokens back. Validation will be handled where it matters,
      // i.e. in the backend. The parseHash from the auth0 library looks useful, but actually fetches the public
      // key from the server every time, which is not only inefficient, but it's also implemented with an
      // old-school callback function which makes it hard to integrate into Vue/Nuxt.
      const params = getQueryParams();
      const idToken = params.token;
      const accessToken = params.access_token;
      console.log("from hash", accessToken);
      setAccessToken(accessToken, this, this.$store);
      setAccessTokenCookie(accessToken, this);
      this.$router.replace('/');
    }
  }
</script>
