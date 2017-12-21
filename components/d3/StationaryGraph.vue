<template>
    <div class="graph">
        <svg :width="fullWidth" :height="fullHeight">
            <g :transform="`translate(${margin.left},${margin.top})`">
                <tijdloze-axes :xScale="xScale" :yScale="yScale" :years="years" />
                <g v-for="song in songs" class="color-1">
                    <path :d="stationarySongLine(song)" class="coloredPath" />
                    <circle
                            v-for="year in stationaryYears(song)"
                            v-if="song.position(year)"
                            class="circle coloredCircle"
                            :cx="xScale(year._yy)"
                            :cy="yScale(song.position(year))"
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
    import _ from 'lodash';

    export default {
      extends: BaseGraph,
      components: {
        TijdlozeAxes: BaseGraphAxes
      },
      props: ['songs'],
      methods: {
        stationarySongLine(song) {
          return this.songLine(song, song.stationaryIntervals());
        },
        stationaryYears(song) {
          return _.flatten(song.stationaryIntervals());
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
