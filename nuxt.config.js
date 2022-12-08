
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'tijdloze.rocks',
    htmlAttrs: {
      lang: 'nl'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'author', content: 'Stijn Vermeeren - contact: www.stijnvermeeren.be/contact' },
      { name: 'keywords', content: 'Tijdloze, Tijdloze 100, De Tijdloze Website, tijdloze.rocks, Tijdloos, Tijdloze100, StuBru, Studio Brussel, muziek, aller tijden, allertijden, beste' },
      { name: 'description', content: 'Statistieken en informatie over de Tijdloze 100, de allertijden-lijst van Studio Brussel' },
      { name: 'robots', content: 'all' },
      { name: 'viewport', content: 'width=480, initial-scale=1'}
    ],
    link: [
      { rel: 'icon', href: '/images/favicon.png?v=3' },
      { rel: 'start', href: 'https://tijdloze.rocks/' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css'}
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  plugins: [
    '~/plugins/global',
    '~/plugins/axios',
    '~/plugins/url',
    '~/plugins/gtag',
    '~/plugins/vue-virtual-scroller',
    '~/plugins/element-ui',
    { src: '~/plugins/auth', mode: 'client'},
    { src: '~/plugins/websocket', mode: 'client'},
    { src: '~/plugins/ssrcache', mode: 'server'}
  ],
  css: [
    { src: 'vue-virtual-scroller/dist/vue-virtual-scroller.css', lang: 'css' }
  ],
  build: {
    transpile: [ // see https://github.com/nuxt/nuxt.js/issues/9223
      'd3-scale'
    ]
  },
  modules: [
    ['@nuxtjs/axios'],
    ['cookie-universal-nuxt', {
      parseJSON: false
    }]
  ],
  publicRuntimeConfig: {
    apiUriClient: process.env.API_URI_CLIENT || "http://localhost:9000/",
    apiUriServer: process.env.API_URI_SERVER || "http://localhost:9000/",
    auth0ClientId: process.env.AUTH0_CLIENT_ID || "bDIm5fEwDBV0IBv5tRb48IPwLhFeysSB",
    auth0ClientDomain: process.env.AUTH0_CLIENT_DOMAIN || "stijnvermeeren-tijdloze-dev.eu.auth0.com",
    auth0Audience: process.env.AUTH0_AUDIENCE || "dev.tijdloze.stijnshome.be",
    auth0CallbackUri: process.env.AUTH0_CALLBACK_URI || "http://localhost:3000/auth/callback",
    auth0LogoutUri: process.env.AUTH0_LOGOUT_URI || "http://localhost:3000/",
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID
  }
};
