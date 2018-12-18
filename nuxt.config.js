const config = require('./config.json');

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
      { name: 'viewport', content: 'width=480, initial-scale=1'},
      { 'http-equiv': 'cache-control', content: 'public, max-age: 30' }
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
  plugins: [
    '~/plugins/global.js',
    '~/plugins/axios',
    '~/plugins/auth'
  ],
  modules: [
    ['@nuxtjs/axios'],
    ['cookie-universal-nuxt', {
      parseJSON: false
    }]
  ],
  router: {
    middleware: 'check-auth',
    scrollBehavior: function (to, from, savedPosition) {
      // if the returned position is falsy or an empty object,
      // will retain current scroll position.
      let position = false

      const maxPathLength = Math.max(from.matched.length, to.matched.length);
      const minPathLength = Math.min(from.matched.length, to.matched.length);
      const criticalPositionIndex = maxPathLength - 2;

      // not parent-child or siblings
      if (maxPathLength < 2 || (maxPathLength - minPathLength) > 1 || to.matched[criticalPositionIndex].path !== from.matched[criticalPositionIndex].path) {
        // scroll to the top of the page
        position = { x: 0, y: 0 }
      } else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
        // if one of the children has scrollToTop option set to true
        position = { x: 0, y: 0 }
      }

      // savedPosition is only available for popstate navigations (back button)
      if (savedPosition) {
        position = savedPosition
      }

      return new Promise(resolve => {
        // wait for the out transition to complete (if necessary)
        window.$nuxt.$once('triggerScroll', () => {
          // coords will be used if no selector is provided,
          // or if the selector didn't match any element.
          if (to.hash && document.querySelector(to.hash)) {
            // scroll to anchor by returning the selector
            position = { selector: to.hash }
          }
          resolve(position)
        })
      })
    }
  }
};

if (config.GOOGLE_ANALYTICS_ID) {
  module.exports.modules.push(
    ['@nuxtjs/google-analytics', {
      id: config.GOOGLE_ANALYTICS_ID
    }]
  );
}
