<template>
    <div>
        <nuxt-link v-if="isAuthenticated" to="/auth/sign-out">
            Log Out
        </nuxt-link>
        <nuxt-link v-else to="/auth/sign-in">
            Log In
        </nuxt-link>
    </div>
</template>

<script>
  export default {
    computed: {
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      }
    }
  }
</script>
