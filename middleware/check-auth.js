import {secondsToExpiry} from '~/utils/jwt'

export default function ({ store, req, app }) {
  // If nuxt generate, pass this middleware
  if (!process.client) return;

  if (store.getters['auth/isAuthenticated']) return;

  const accessToken = app.$cookies.get('access_token');
  if (accessToken) {
    if (secondsToExpiry(accessToken) > 0) {
      store.commit('auth/setAccessToken', accessToken);

      return app.$axios.get(`user`).then(response => {
        store.commit('auth/setUser', response.data);
      });
    } else {
      if (process.client) {
        app.$auth.checkSession()
      }
    }
  }
}
