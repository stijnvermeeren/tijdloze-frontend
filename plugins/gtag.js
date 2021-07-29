import Vue from "vue";
import VueGtag from "vue-gtag";

export default ({ app }) => {
  if (process.env.GOOGLE_ANALYTICS_ID) {
    Vue.use(VueGtag, {
      config: {id: process.env.GOOGLE_ANALYTICS_ID},
    }, app.router);
  }
}
