import {createAuth0, useAuth0} from '@auth0/auth0-vue';
import {useAuthStore} from "~/stores/auth";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    nuxtApp.vueApp.use(
        createAuth0({
            domain: config.public.auth0ClientDomain,
            clientId: config.public.auth0ClientId,
            authorizationParams: {
                redirect_uri: config.public.auth0CallbackUri,
                audience: config.public.auth0Audience
            }
        })
    );
})