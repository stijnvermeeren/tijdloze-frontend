
require('dotenv').config()

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'De Tijdloze Website',
    titleTemplate: '%s - De Tijdloze Website',
    htmlAttrs: {
      lang: 'nl',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'author', content: 'Stijn Vermeeren - contact: www.stijnvermeeren.be/contact' },
      { name: 'keywords', content: 'Tijdloze, Tijdloze 100, De Tijdloze Website, Tijdloos, Tijdloze100, StuBru, Studio Brussel, muziek, aller tijden, allertijden, beste' },
      { name: 'description', content: 'Statistieken en informatie over de Tijdloze 100, de allertijden-lijst van Studio Brussel' },
      { name: 'robots', content: 'all' },
      { name: 'viewport', content: 'width=480, initial-scale=1'}
    ],
    link: [
      { rel: 'icon', href: '/images/favicon.png?v=3' },
      { rel: 'start', href: 'http://tijdloze.stijnshome.be/' },
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
    { src: '~/plugins/auth', mode: 'client'},
    { src: '~/plugins/websocket', mode: 'client'}
  ],
  buildModules: [
    '@nuxtjs/dotenv',
  ],
  modules: [
    ['@nuxtjs/axios'],
    ['cookie-universal-nuxt', {
      parseJSON: false
    }]
  ]
};

if (process.env.GOOGLE_ANALYTICS_ID) {
  module.exports.modules.push(
    ['@nuxtjs/google-analytics', {
      id: process.env.GOOGLE_ANALYTICS_ID
    }]
  );
}
