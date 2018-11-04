import auth0 from 'auth0-js';
import Cookie from 'js-cookie';

const config = require('~/config.json');

const SCOPE = 'openid profile email';


const auth = new auth0.WebAuth({
  clientID: config.AUTH0_CLIENT_ID,
  domain: config.AUTH0_CLIENT_DOMAIN
});

export function login() {
  auth.authorize({
    responseType: 'token id_token',
    redirectUri: config.AUTH0_CALLBACK_URI,
    audience: config.AUTH0_AUDIENCE,
    scope: SCOPE
  });
}

export const getTokensFromHash = (callback) => {
  return auth.parseHash({}, function(err, authResult) {
    if (err) {
      return console.log(err);
    }
    callback(authResult);
  });
}

export const setAccessToken = (token, app, store) => {
  app.$cookies.set('access_token', token, { secure: config.SECURE_COOKIES, path: '/' });
  app.$axios.setToken(token, 'Bearer');
  store.commit('setAccessToken', token);
}

export const unsetAccessToken = (app, store) => {
  app.$cookies.remove('access_token', { path: '/' });
  app.$axios.setToken(false);
  store.commit('setAccessToken', null);
}
