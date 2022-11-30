import Vue from "vue";
import VueGtag from "vue-gtag";

export default ({ app, $config }) => {
  if ($config.GOOGLE_ANALYTICS_ID) {
    Vue.use(VueGtag, {
      config: {id: $config.GOOGLE_ANALYTICS_ID},
    }, app.router);
  }
}
