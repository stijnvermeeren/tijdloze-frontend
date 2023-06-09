import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    user: null,
  }),
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    isAdmin(state) {
      return this.isAuthenticated && state.user.isAdmin;
    },
    displayName(state) {
      if (state.user) {
        return state.user.displayName;
      }
    },
    displayNameWithFallback(state) {
      if (state.user) {
        if (state.user.displayName) {
          return state.user.displayName;
        } else if (state.user.name) {
          return state.user.name;
        } else {
          return state.user.email;
        }
      }
    }
  },
  actions: {
    setAccessToken(accessToken) {
      this.accessToken = accessToken || null;
    },
    setUser(user) {
      this.user = user || null
    }
  }
})
