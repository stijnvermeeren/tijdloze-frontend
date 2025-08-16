import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)
  const user = ref(null)

  const isAuthenticated = computed(() => {
    return !!user.value;
  })
  const isAdmin = computed(() => {
    return isAuthenticated.value && user.value.isAdmin;
  })
  const displayName = computed(() => {
    if (user.value) {
      return user.value.displayName;
    }
  })
  const displayNameWithFallback = computed(() => {
    if (user.value) {
      if (user.value.displayName) {
        return user.value.displayName;
      } else if (user.value.name) {
        return user.value.name;
      } else {
        return user.value.email;
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
