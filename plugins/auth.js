import createAuth0Client from '@auth0/auth0-spa-js';

export default async ({ app, store }, inject) => {
  const SCOPE = 'openid profile email';

  const authParams = {
    responseType: 'token id_token',
    audience: process.env.AUTH0_AUDIENCE,
    scope: SCOPE
  }

  const auth = await createAuth0Client({
    client_id: process.env.AUTH0_CLIENT_ID,
    domain: process.env.AUTH0_CLIENT_DOMAIN,
    redirect_uri: process.env.AUTH0_CALLBACK_URI
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
        returnTo: process.env.AUTH0_LOGOUT_URI
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
