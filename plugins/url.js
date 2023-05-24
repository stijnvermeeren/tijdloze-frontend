
import url from 'url';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  return {
    provide: {
      url: {
        // Return websocket URL that uses wss/ws depending on whether API_URI_CLIENT uses https/http
        websocket(path) {
          const websocketUrl = url.parse(config.apiUriClient)
          websocketUrl.protocol = (websocketUrl.protocol === "https:") ? "wss:" : "ws:"
          return websocketUrl.resolve(path)
        }
      }
    }
  }
})
