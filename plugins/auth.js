import { Auth0Client } from '@auth0/auth0-spa-js';

export default async ({ app, store, $config }, inject) => {
  const SCOPE = 'openid profile email';

  const authParams = {
    responseType: 'token id_token',
    audience: $config.auth0Audience,
    scope: SCOPE
  }

  const auth = new Auth0Client({
    client_id: $config.auth0ClientId,
    domain: $config.auth0ClientDomain,
    redirect_uri: $config.auth0CallbackUri
  });

  function unsetAccessToken() {
    store.commit('auth/setAccessToken', null);
  }

  async function loginSilently() {
    try {
      const accessToken = await auth.getTokenSilently(authParams);
      store.commit('auth/setAccessToken', accessToken);

      const user = await auth.getUser(authParams);
      await setUser(user);
    } catch(err) {
      // user not logged in, don't raise any error
    }
  }

  async function setUser(user) {
    const data = {
      name: user.name,
      firstName: user.given_name,
      lastName: user.family_name,
      nickname: user.nickname,
      email: user.email,
      emailVerified: user.email_verified
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
      auth.loginWithRedirect(authParams);
    },
    logout() {
      unsetAccessToken()
      auth.logout({
        returnTo: $config.auth0LogoutUri
      });
    },
    unsetAccessToken() {
      unsetAccessToken()
    },
    async loginSilently() {
      return await loginSilently();
    },
    async loginCallback() {
      await auth.handleRedirectCallback();
      return await loginSilently();
    }
  });
}
