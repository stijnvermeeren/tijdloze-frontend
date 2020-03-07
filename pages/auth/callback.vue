<template lang="pug">
  p Je wordt aangemeld...
</template>

<script>
  export default {
    async mounted () {
      await this.$auth.loginCallback();

      const sessionRedirectPath = sessionStorage.getItem("redirectPath");
      sessionStorage.removeItem("redirectPath");
      const redirectPath = sessionRedirectPath ? sessionRedirectPath : '/';
      this.$router.replace(redirectPath);
    }
  }
</script>
