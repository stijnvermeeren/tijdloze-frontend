<template>
    <div class="graph">
        <h4 v-if="$slots.default || title">
            <slot>{{title}}</slot>
        </h4>
        <svg :width="fullWidth" :height="fullHeight">
            <g :transform="`translate(${margin.left},${margin.top})`">
                <tijdloze-axes :xScale="xScale" :yScale="yScale" :years="years" />
                <g class="color-1">
                    <circle
                            v-for="point in points"
                            class="circle coloredCircle"
                            :cx="xScale(point.year._yy)"
                            :cy="yScale(point.song.position(point.year))"
                            r="3"
                    />
                </g>
                <g class="color-2">
                    <circle
                            v-for="point in secondaryPoints"
                            class="circle coloredCircle"
                            :cx="xScale(point.year._yy)"
                            :cy="yScale(point.song.position(point.year))"
                            r="3"
                    />
                </g>
            </g>
        </svg>
    </div>
</template>

<script>
    import BaseGraph from './BaseGraph';
    import BaseGraphAxes from './BaseGraphAxes';

    export default {
      extends: BaseGraph,
      components: {
        TijdlozeAxes: BaseGraphAxes
      },
      props: {
        title: {
          type: String
        },
        points: {
          type: Array,
          default: () => []
        },
        secondaryPoints: {
          type: Array,
          default: () => []
        }
      }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/graphColors.less";

    div.graph {
        text-align: center;
        padding: 20px 0;

        svg {
            height: 400px;
            width: 750px;
            background-color: white;
            font-size: 11px;
        }
    }
</style>
