<template>
    <p>Signing in...</p>
</template>

<script>
  import { setAccessToken, getQueryParams, setAccessTokenCookie } from '~/utils/auth'
  import jwtDecode from 'jwt-decode'

  export default {
    mounted () {
      // In the frontend, we assume that we get valid tokens back. Validation will be handled where it matters,
      // i.e. in the backend. The parseHash from the auth0 library looks useful, but actually fetches the public
      // key from the server every time, which is not only inefficient, but it's also implemented with an
      // old-school callback function which makes it hard to integrate into Vue/Nuxt.
      const params = getQueryParams();
      const idToken = params.id_token;
      const accessToken = params.access_token;

      setAccessToken(accessToken, this, this.$store);
      setAccessTokenCookie(accessToken, this);

      const idTokenDecoded = jwtDecode(idToken);
      const data = {
        name: idTokenDecoded.name,
        firstName: idTokenDecoded.given_name,
        lastName: idTokenDecoded.family_name,
        nickname: idTokenDecoded.nickname,
        email: idTokenDecoded.email,
        emailVerified: idTokenDecoded.email_verified
      };
      this.$axios.$post(`user`, data).then(user => {
        this.$store.commit('setUser', user);
        const sessionRedirectPath = sessionStorage.getItem("redirectPath");
        sessionStorage.removeItem("redirectPath");
        const redirectPath = sessionRedirectPath ? sessionRedirectPath : '/';
        this.$router.replace(redirectPath);
      });
    }
  }
</script>
