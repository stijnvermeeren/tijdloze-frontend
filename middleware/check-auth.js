import {secondsToExpiry} from '~/utils/jwt'

export default function ({ store, req, app }) {
  // If nuxt generate, pass this middleware
  if (!process.client) return;

  if (store.getters.isAuthenticated) return;

  const accessToken = app.$cookies.get('access_token');
  if (accessToken) {
    if (secondsToExpiry(accessToken) > 0) {
      store.commit('setAccessToken', accessToken);

      return app.$axios.get(`user`).then(response => {
        store.commit('setUser', response.data);
      });
    } else {
      if (process.client) {
        app.$auth.checkSession()
      }
    }
  }
}
