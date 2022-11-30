import Vue from "vue";
import VueGtag from "vue-gtag";

export default ({ app, $config }) => {
  if ($config.googleAnalyticsId) {
    Vue.use(VueGtag, {
      config: {id: $config.googleAnalyticsId},
    }, app.router);
  }
}
