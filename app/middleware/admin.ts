import { authGuard } from '@auth0/auth0-vue'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (import.meta.client) {
    const loggedIn = await authGuard(to)
    if (loggedIn) {
      if (!authStore.isAdmin) {
        return navigateTo('/', { replace: true, external: true })
      }
    } else {
      return navigateTo('/', { replace: true, external: true })
    }
  } else {
    return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } }, { replace: true })
  }
})
