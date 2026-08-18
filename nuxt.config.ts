import vuetify from 'vite-plugin-vuetify';
import type { PluginOption } from 'vite'

export default defineNuxtConfig({
  site: { 
    url: 'https://tijdloze.rocks', 
    name: 'tijdloze.rocks' 
  },
  sitemap: {
    sources: [
      '/api/__sitemap__/urls',
    ]
  },
  routeRules: {
    '/admin/**': { robots: false },
  },
  compatibilityDate: '2025-01-31',
  ssr: true,
  runtimeConfig: {
    public: {
      // Allow to use env variables at build-time to override the defaults (e.g. for AWS Amplify)
      apiUriClient: process.env.NUXT_PUBLIC_API_URI_CLIENT || "http://localhost:9000/",
      apiUriServer: process.env.NUXT_PUBLIC_API_URI_SERVER || "http://localhost:9000/",
      auth0ClientId: process.env.NUXT_PUBLIC_AUTH0_CLIENT_ID || "bDIm5fEwDBV0IBv5tRb48IPwLhFeysSB",
      auth0ClientDomain: process.env.NUXT_PUBLIC_AUTH0_CLIENT_DOMAIN || "stijnvermeeren-tijdloze-dev.eu.auth0.com",
      auth0Audience: process.env.NUXT_PUBLIC_AUTH0_AUDIENCE || "dev.tijdloze.stijnshome.be",
      auth0CallbackUri: process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URI || "http://localhost:3000/auth/callback",
      auth0LogoutUri: process.env.NUXT_PUBLIC_AUTH0_LOGOUT_URI || "http://localhost:3000/"
    }
  },
  /*
  ** Headers of the page
  */
  app: {
    head: {
      title: 'tijdloze.rocks'
    }
  },
  build: {
    transpile: [
      'vuetify',
      'd3-scale', // see https://github.com/nuxt/nuxt.js/issues/9223
    ]
  },
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/seo',
    'nuxt-gtag',
    /* Treeshaking: https://next.vuetifyjs.com/en/features/treeshaking/ */
    async (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config => {
        (config.plugins as PluginOption[]).push(vuetify({}))
      })
    }
  ],
  devtools: {
    // https://github.com/nuxt/devtools/issues/259
    componentInspector: false,

    enabled: true,
  },
  vite: {
    optimizeDeps: {
      include: [
        'sanitize-html', // CJS
        'd3-array',
        'd3-shape',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@auth0/auth0-vue',
        'sockette',
        'ramda',
        '@mdi/js',
        'vue-boring-avatars',
      ]
    }
  },
});
