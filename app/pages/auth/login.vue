<template lang="pug">
p Je wordt aangemeld...
</template>

<script setup lang="ts">
import {authGuard, useAuth0} from '@auth0/auth0-vue';

onMounted( async () => {
  const auth0 = useAuth0()
  const loggedIn = await authGuard(useRoute())
  if (loggedIn) {
    await useSetUser(auth0)
    const redirect = useRouteQueryParam('redirect')
    navigateTo(redirect || '/', {replace: true})
  }
})
</script>
