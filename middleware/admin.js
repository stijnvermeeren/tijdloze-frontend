import {useAuthStore} from "~/stores/auth";
import {authGuard, useAuth0} from "@auth0/auth0-vue";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  const auth0 = useAuth0()

  const loggedIn = await authGuard(to)
  if (loggedIn) {
    await useSetUser(auth0)
    if (!authStore.isAdmin) {
      return navigateTo('/', {replace: true, external: true})
    }
  } else {
    return navigateTo('/', {replace: true, external: true})
  }
})
