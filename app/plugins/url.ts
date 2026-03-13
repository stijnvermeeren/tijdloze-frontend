export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  return {
    provide: {
      url: {
        // Return websocket URL that uses wss/ws depending on whether apiUriClient uses https/http.
        websocket(path: string): string {
          const websocketUrl = new URL(config.public.apiUriClient as string)
          websocketUrl.protocol = websocketUrl.protocol === "https:" ? "wss:" : "ws:"
          return new URL(path, websocketUrl).toString()
        }
      }
    }
  }
})