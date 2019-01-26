<template lang="pug">
  .graph
    svg(:viewBox='`0 0 ${fullWidth} ${fullHeight}`' xmlns='http://www.w3.org/2000/svg')
      g(:transform='`translate(${margin.left},${margin.top})`')
        tijdloze-axes(
          :x-scale='xScale'
          :y-scale='yScale'
          :years='years'
        )
        g.color-1(v-for='song in songs')
          path.coloredPath(:d='stationarySongLine(song)')
          circle.circle.coloredCircle(
            v-for='year in stationaryYears(song)'
            v-if='song.position(year)'
            :cx='xScale(year._yy)'
            :cy='yScale(song.position(year))'
            r='3'
          )
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
        return this.songLine(song, song.stationaryIntervals(this.years), true);
      },
      stationaryYears(song) {
        return _.flatten(song.stationaryIntervals(this.years));
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
      box-sizing: border-box;
      width: 100%;
      padding: 0 2em;
      background-color: white;
      font-size: 11px;
    }
  }
</style>
