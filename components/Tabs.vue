<template>
    <div class="tabs">
        <div class="tabtitels">
            <h3 v-for="tab in tabs" :key="tab.to" :class="{selected: !tab.to}">
                <nuxt-link v-if="tab.to" :to="tab.to">{{tab.title}}</nuxt-link>
                <span v-else>{{tab.title}}</span>
            </h3>
        </div>
        <div class="tab">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
      props: ["tabs", "selected"]
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
            h3.selected {
                border-bottom: 2px @backgroundColor solid;
                background-color: @backgroundColor;
                a {
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
