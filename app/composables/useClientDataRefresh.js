export default function (refresh) {
    const nuxtApp = useNuxtApp()
    onMounted(() => {
        // https://github.com/nuxt/nuxt/issues/24352
        if (nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
            // https://github.com/nuxt/nuxt/discussions/25934
            setTimeout(refresh, 1)
        }
    })
}