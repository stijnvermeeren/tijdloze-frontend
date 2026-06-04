declare module "#app" {
  interface NuxtApp {
    $url: {
      websocket: (path: string) => string
    }
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $url: {
      websocket: (path: string) => string
    }
  }
}

export {}