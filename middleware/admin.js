import {useAuthStore} from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  if (!authStore.isAdmin) {
    return navigateTo({ path : '/auth/admin', query: { redirect: to }})
  }
})
