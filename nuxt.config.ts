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
      apiUriClient: "http://localhost:9000/",
      apiUriServer: "http://localhost:9000/",
      auth0ClientId: "bDIm5fEwDBV0IBv5tRb48IPwLhFeysSB",
      auth0ClientDomain: "stijnvermeeren-tijdloze-dev.eu.auth0.com",
      auth0Audience: "dev.tijdloze.stijnshome.be",
      auth0CallbackUri: "http://localhost:3000/auth/callback",
      auth0LogoutUri: "http://localhost:3000/"
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
      'pinia', 'pinia-orm' // see https://github.com/nuxt/nuxt/issues/20128
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
});
