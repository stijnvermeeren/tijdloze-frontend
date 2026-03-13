import type { TypedApi } from '~/api/client'

declare module '#app' {
  interface NuxtApp {
    $api: TypedApi
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: TypedApi
  }
}

export {}
