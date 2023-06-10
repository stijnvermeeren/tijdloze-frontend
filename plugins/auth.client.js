import {useAuthStore} from "~/stores/auth";
import {createAuth0, useAuth0} from "@auth0/auth0-vue";
import {usePollStore} from "~/stores/poll";

export default defineNuxtPlugin(async nuxtApp => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const SCOPE = 'openid profile email';

  const auth = createAuth0({
    domain: config.public.auth0ClientDomain,
    clientId: config.public.auth0ClientId,
    authorizationParams: {
      redirect_uri: config.public.auth0CallbackUri,
      responseType: 'token id_token',
      audience: config.public.auth0Audience,
      scope: SCOPE
    }
  })
  nuxtApp.vueApp.use(auth)

  function unsetAccessToken() {
    authStore.setAccessToken(null);
  }

  async function loginSilently() {
    try {
      const accessToken = await auth.getAccessTokenSilently();
      authStore.setAccessToken(accessToken);

      await setUser(auth.user.value);
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
    const {data: userData} = await useApiFetchPost('user', data)
    authStore.setUser(userData.value);

    // TODO don't do await, do it in the background instead
    const {data: pollData} = await useApiFetch('poll/my-votes')
    usePollStore().setVotes(pollData.value.votes);
  }

  const authInjectable = {
    login(redirectPath) {
      sessionStorage.setItem("redirectPath", redirectPath);
      unsetAccessToken()
      auth.loginWithRedirect();
    },
    logout() {
      unsetAccessToken()
      auth.logout({
        logoutParams: {
          returnTo: config.public.auth0LogoutUri
        }
      });
    },
    unsetAccessToken() {
      unsetAccessToken()
    },
    async loginSilently() {
      return await loginSilently();
    },
    async loginCallback() {
      auth.handleRedirectCallback();
      return await loginSilently();
    }
  }

  nuxtApp.vueApp.provide('auth', authInjectable)

  return {
    provide: {
      auth: authInjectable
    }
  }
});
