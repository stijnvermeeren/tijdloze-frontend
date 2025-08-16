import {useAuthStore} from "~/stores/auth";

// https://nuxt.com/docs/guide/recipes/custom-usefetch#custom-usefetch
export default defineNuxtPlugin((nuxtApp) => {
    const authStore = useAuthStore()
    const apiUri = useApiUri()

    const api = $fetch.create({
        onRequest({ request, options, error }) {
            options.baseURL = apiUri
            const token = authStore.accessToken
            if (token) {
                // note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
                options.headers.set('Authorization', `Bearer ${token}`)
            }
        }
    })

    // Expose to useNuxtApp().$api
    return {
        provide: {
            api
        }
    }
})