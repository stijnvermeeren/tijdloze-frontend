import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import {RecycleScroller} from "vue-virtual-scroller";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('RecycleScroller', RecycleScroller)
})
