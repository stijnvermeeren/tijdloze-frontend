require('dotenv').config();

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
      { name: 'robots', content: 'all' }
    ],
    link: [
      { rel: 'icon', href: '/images/favicon.png?v=3' },
      { rel: 'start', href: 'http://tijdloze.stijnshome.be/' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  plugins: ['~/plugins/global.js'],
  modules: [
    '@nuxtjs/dotenv',
    ['@nuxtjs/axios', {
      baseURL: process.env.BASE_URL
    }]
  ],
  build: {
    vendor: ['axios'],
    babel: {
      presets: ['vue-app']
    }
  }
};
