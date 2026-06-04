import type { ApiRequestOptions, TypedApi } from '~/api/client'
import type { ApiEndpoint } from '~/api/endpoints'
import { buildApiCall } from '~/api/client'
import {useAuthStore} from "~/stores/auth";

// https://nuxt.com/docs/guide/recipes/custom-usefetch#custom-usefetch
export default defineNuxtPlugin((nuxtApp) => {
    const authStore = useAuthStore()
    const apiUri = useApiUri()

    const rawApi = $fetch.create({
        onRequest({ request, options, error }) {
            options.baseURL = apiUri
            const token = authStore.accessToken
            if (token) {
                // note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
                options.headers.set('Authorization', `Bearer ${token}`)
            }
        }
    })

    const api = (async (
        input: ApiEndpoint<unknown, unknown>,
        arg1?: unknown,
        arg2: ApiRequestOptions = {}
    ) => {
        const { path, options } = buildApiCall(input, arg1, arg2)
        return await rawApi(path, options)
    }) as TypedApi

    // Expose to useNuxtApp().$api
    return {
        provide: {
            api,
            rawApi,
        }
    }
})