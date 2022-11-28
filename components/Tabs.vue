<template lang="pug">
  .tabs
    .tabtitels
      h3(v-for='tab in tabs' :key='tab.to' :class='{selected: tab.to === $route.path}')
        nuxt-link(v-if='tab.to !== $route.path' :to='tab.to') {{tab.title}}
        span(v-else) {{tab.title}}
    .tab
      slot
</template>

<script>
  export default {
    props: ["tabs"]
  }
</script>

<style lang="scss">
  @use '../assets/styleConfig';

  div.tabs {
    div.tabtitels {
      margin: 0 0 0 15px;
      padding: 0;
      vertical-align: top;
      h3 {
        vertical-align: top;
        display: inline;
        font-size: 14px;
        border: styleConfig.$blackLine;
        border-radius: styleConfig.$borderRadius styleConfig.$borderRadius 0 0;
        padding: 2px 10px;
        margin: 0 7px;
        background-color: styleConfig.$headerBackgroundColor;
      }
      h3.selected {
        border-bottom: 2px styleConfig.$backgroundColor solid;
        background-color: styleConfig.$backgroundColor;
        a {
          color: black;
        }
      }
    }
    div.tab {
      padding: 17px 20px 17px 20px;
      @include styleConfig.border;
    }
  }
</style>
