
module.exports = defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiUriClient: "http://localhost:9000/",
      apiUriServer: "http://localhost:9000/",
      auth0ClientId: "bDIm5fEwDBV0IBv5tRb48IPwLhFeysSB",
      auth0ClientDomain: "stijnvermeeren-tijdloze-dev.eu.auth0.com",
      auth0Audience: "dev.tijdloze.stijnshome.be",
      auth0CallbackUri: "http://localhost:3000/auth/callback",
      auth0LogoutUri: "http://localhost:3000/",
      googleAnalyticsId: ''
    }
  },
  /*
  ** Headers of the page
  */
  app: {
    head: {
      title: 'tijdloze.rocks',
    }
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  css: [
    { src: 'vue-virtual-scroller/dist/vue-virtual-scroller.css', lang: 'css' }
  ],
  build: {
    transpile: [ // see https://github.com/nuxt/nuxt.js/issues/9223
      'd3-scale'
    ]
  },
  modules: [
    ['@pinia/nuxt', '@element-plus/nuxt']
  ]
});
