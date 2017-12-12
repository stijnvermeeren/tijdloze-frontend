<template>
    <div class="tabs">
        <div class="tabtitels">
            <nuxt-link v-for="tab in tabs" :to="tab.to" :key="tab.to" tag="h3"><a>{{tab.title}}</a></nuxt-link>
        </div>
        <div class="tab">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
      props: ["tabs"]
    }
</script>

<style lang="less">
    @import '../assets/styleConfig.less';

    div.tabs {
        div.tabtitels {
            margin: 1.5em 0 0 0;
            padding: 0.2em 0 0.2em 2em;
            vertical-align: top;
            h3 {
                vertical-align: top;
                display: inline;
                font-size: 115%;
                border: @blackLine;
                border-radius: @borderRadius @borderRadius 0 0;
                padding: 0.2em 1em;
                margin: 0 0.7em;
                background-color: @headerBackgroundColor;
            }
            h3.router-link-exact-active {
                border-bottom: 2px @backgroundColor solid;
                background-color: @backgroundColor;
                a {
                    cursor: default;
                    color: black;
                }
            }
        }
        div.tab {
            padding: 1.7em 2em 1.7em 2em;
            .border;
        }
    }
</style>
