import VueGtag from "vue-gtag";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  if (config.googleAnalyticsId) {
    nuxtApp.vueApp.use(
      VueGtag,
      {
        config: {
          id: $config.googleAnalyticsId
        }
      },
      useRouter()
    )
  }
})
