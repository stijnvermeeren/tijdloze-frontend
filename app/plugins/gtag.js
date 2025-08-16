import { configure } from "vue-gtag";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  if (config.public.googleAnalyticsId) {
    configure({
      tagId: config.public.googleAnalyticsId
    })
  }
})
