<template>
    <p>Je wordt aangemeld...</p>
</template>

<script>
  export default {
    async mounted () {
      // In the frontend, we assume that we get valid tokens back. Validation will be handled where it matters,
      // i.e. in the backend. The parseHash from the auth0 library looks useful, but actually fetches the public
      // key from the server every time, which is not only inefficient, but it's also implemented with an
      // old-school callback function which makes it hard to integrate into Vue/Nuxt.
      const params = this.$auth.getQueryParams();
      const idToken = params.id_token;
      const accessToken = params.access_token;

      await this.$auth.loginCallback(idToken, accessToken);

      const sessionRedirectPath = sessionStorage.getItem("redirectPath");
      sessionStorage.removeItem("redirectPath");
      const redirectPath = sessionRedirectPath ? sessionRedirectPath : '/';
      this.$router.replace(redirectPath);
    }
  }
</script>
