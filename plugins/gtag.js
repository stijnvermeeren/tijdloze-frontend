import VueGtag from "vue-gtag";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  if (config.googleAnalyticsId) {
    nuxtApp.vueApp.use(VueGtag, {
      property: {
        id: $config.googleAnalyticsId
      }
    })
    trackRouter(useRouter())
  }
})
