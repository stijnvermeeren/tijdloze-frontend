import { setAccessToken, unsetAccessToken } from '~/utils/auth'
import jwtDecode from 'jwt-decode'

export default function ({ store, req, app }) {
  // If nuxt generate, pass this middleware
  if (process.server && !req) return;

  if (store.getters.isAuthenticated) return;

  const accessToken = app.$cookies.get('access_token');
  if (accessToken) {
    const jwt = jwtDecode(accessToken);
    if (jwt && jwt.exp && jwt.exp > Date.now().valueOf() / 1000) {
      setAccessToken(accessToken, app, store);

      return app.$axios.get(`user`).then(response => {
        store.commit('setUser', response.data);
      });
    } else {
      unsetAccessToken(app, store)
    }
  }
}
