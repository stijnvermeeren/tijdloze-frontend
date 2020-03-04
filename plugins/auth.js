import auth0 from 'auth0-js';
import jwtDecode from 'jwt-decode';

export default ({ app, store }, inject) => {
  const SCOPE = 'openid profile email';

  const authParams = {
    responseType: 'token id_token',
    redirectUri: process.env.AUTH0_CALLBACK_URI,
    audience: process.env.AUTH0_AUDIENCE,
    scope: SCOPE
  }

  const auth = new auth0.WebAuth({
    clientID: process.env.AUTH0_CLIENT_ID,
    domain: process.env.AUTH0_CLIENT_DOMAIN
  });

  function unsetAccessToken() {
    app.$cookies.remove('access_token', { path: '/' });
    store.commit('auth/setAccessToken', null);
  }

  async function loginCallback(idToken, accessToken) {
    store.commit('auth/setAccessToken', accessToken);
    app.$cookies.set(
      'access_token',
      accessToken,
      {
        secure: !! process.env.SECURE_COOKIES,
        path: '/',
        maxAge: 3600 * 24 * 30,
        sameSite: 'strict'
      }
    );

    const idTokenDecoded = jwtDecode(idToken);
    const data = {
      name: idTokenDecoded.name,
      firstName: idTokenDecoded.given_name,
      lastName: idTokenDecoded.family_name,
      nickname: idTokenDecoded.nickname,
      email: idTokenDecoded.email,
      emailVerified: idTokenDecoded.email_verified
    };
    await app.$axios.$post('user', data).then(user => {
      store.commit('auth/setUser', user);
    });

    // Don't await / do in the background
    app.$axios.$get('poll/my-votes').then(result => {
      store.commit('poll/setVotes', result.votes);
    });
  }

  inject('auth', {
    login(redirectPath) {
      sessionStorage.setItem("redirectPath", redirectPath);
      unsetAccessToken()
      auth.authorize(authParams);
    },
    logout() {
      unsetAccessToken()
      auth.logout({
        returnTo: config.AUTH0_LOGOUT_URI
      });
    },
    getQueryParams() {
      const params = {}
      window.location.href.replace(/([^(?|#)=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
        params[$1] = $3
      })
      return params
    },
    unsetAccessToken() {
      unsetAccessToken()
    },
    checkSession(onError, onSuccess) {
      auth.checkSession(authParams, (error, authResult) => {
        if (error) {
          onError(error)
        }
        if (authResult) {
          onSuccess(authResult)
        }
      })
    },
    async loginCallback(idToken, accessToken) {
      await loginCallback(idToken, accessToken)
    }
  });
}
