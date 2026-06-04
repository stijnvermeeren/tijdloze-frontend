import type { TypedApi } from '~/api/client'

declare module '#app' {
  interface NuxtApp {
    $api: TypedApi
    $rawApi: typeof $fetch
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: TypedApi
    $rawApi: typeof $fetch
  }
}

export {}
