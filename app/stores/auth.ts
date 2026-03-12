import { defineStore } from 'pinia'

interface AuthUser {
  id?: string
  isAdmin?: boolean
  displayName?: string
  name?: string
  email?: string
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const user = ref<AuthUser | null>(null)

  const isAuthenticated = computed<boolean>(() => {
    return user.value !== null
  })
  const isAdmin = computed<boolean>(() => {
    return isAuthenticated.value && user.value?.isAdmin === true
  })
  const displayName = computed<string | undefined>(() => {
    return user.value?.displayName
  })
  const displayNameWithFallback = computed<string | undefined>(() => {
    if (user.value) {
      if (user.value.displayName) {
        return user.value.displayName
      } else if (user.value.name) {
        return user.value.name
      } else {
        return user.value.email
      }
    }
  })

  return {
    accessToken,
    displayName,
    displayNameWithFallback,
    isAdmin,
    isAuthenticated,
    user
  }
})
