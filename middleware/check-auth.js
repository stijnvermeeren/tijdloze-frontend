import { setAccessToken } from '~/utils/auth'

export default function ({ store, req, app }) {
  // If nuxt generate, pass this middleware
  if (process.server && !req) return;

  const accessToken = app.$cookies.get('access_token');
  if (accessToken) {
    setAccessToken(accessToken, app, store);
  }
}
