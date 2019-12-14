
import {secondsToExpiry} from '~/utils/jwt'

export const state = () => ({
  accessToken: null,
  user: null,
})

export const getters = {
  isAuthenticated (state) {
    return !!state.user;
  },
  isAdmin (state, getters) {
    return getters.isAuthenticated && state.user.isAdmin;
  },
  displayName (state) {
    if (state.user) {
      return state.user.displayName;
    }
  },
  displayNameWithFallback (state) {
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
}

export const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken || null;

    if (process.client && accessToken) {
      if (secondsToExpiry(accessToken) > 2) {
        setTimeout(() => {
          this.$auth.checkSession();
        }, 1000 * (secondsToExpiry(accessToken) - 2))
      }
    }
  },
  setUser(state, user) {
    state.user = user || null
  }
}
