import auth0 from 'auth0-js';

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

export function logout() {
  auth.logout({
    returnTo: config.AUTH0_LOGOUT_URI
  });
}

export const getQueryParams = () => {
  const params = {}
  window.location.href.replace(/([^(?|#)=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    params[$1] = $3
  })
  return params
}

export const setAccessTokenCookie = (token, app) => {
  app.$cookies.set('access_token', token, { secure: config.SECURE_COOKIES, path: '/' });
}

export const setAccessToken = (token, app, store) => {
  store.commit('setAccessToken', token);
}

export const unsetAccessToken = (app, store) => {
  app.$cookies.remove('access_token', { path: '/' });
  store.commit('setAccessToken', null);
}
