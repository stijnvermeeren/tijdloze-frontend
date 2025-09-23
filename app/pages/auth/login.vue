<template lang="pug">
p Je wordt aangemeld...
</template>

<script setup>
import {authGuard, useAuth0} from '@auth0/auth0-vue';

onMounted( async () => {
  const auth0 = useAuth0()
  const loggedIn = await authGuard(useRoute())
  if (loggedIn) {
    await useSetUser(auth0)
    const redirect = useRoute().query['redirect']
    navigateTo(redirect ? redirect : '/', {replace: true})
  }
})
</script>
