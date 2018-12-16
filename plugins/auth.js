import auth0 from 'auth0-js';
import jwtDecode from 'jwt-decode';

const config = require('~/config.json');

export default ({ app, store, route }, inject) => {
  const SCOPE = 'openid profile email';

  const authParams = {
    responseType: 'token id_token',
    redirectUri: config.AUTH0_CALLBACK_URI,
    audience: config.AUTH0_AUDIENCE,
    scope: SCOPE
  }

  const auth = new auth0.WebAuth({
    clientID: config.AUTH0_CLIENT_ID,
    domain: config.AUTH0_CLIENT_DOMAIN
  });

  function unsetAccessToken() {
    app.$cookies.remove('access_token', { path: '/' });
    store.commit('setAccessToken', null);
  }

  function loginCallback(idToken, accessToken) {
    store.commit('setAccessToken', accessToken);
    app.$cookies.set(
      'access_token',
      accessToken,
      { secure: config.SECURE_COOKIES, path: '/', maxAge: 3600 * 24 * 30 }
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
    app.$axios.$post('user', data).then(user => {
      store.commit('setUser', user);
      const sessionRedirectPath = sessionStorage.getItem("redirectPath");
      sessionStorage.removeItem("redirectPath");
      const redirectPath = sessionRedirectPath ? sessionRedirectPath : '/';
      app.router.replace(redirectPath);
    });
  }

  inject('auth', {
    login() {
      sessionStorage.setItem("redirectPath", route.path);
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
    checkSession() {
      console.log("checkSession")
      auth.checkSession(authParams, (err, authResult) => {
        if (err) {
          unsetAccessToken()
        }
        if (authResult) {
          loginCallback(authResult.idToken, authResult.accessToken)
        }
      })
    },
    loginCallback(idToken, accessToken) {
      loginCallback(idToken, accessToken)
    }
  });
}
