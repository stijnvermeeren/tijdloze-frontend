import VueGtag from "vue-gtag";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  if (config.public.googleAnalyticsId) {
    nuxtApp.vueApp.use(
      VueGtag,
      {
        config: {
          id: config.public.googleAnalyticsId
        }
      },
      useRouter()
    )
  }
})
