<template lang="pug">
  .graph
    svg(:viewbox='`0 0 ${fullWidth} ${fullHeight}`' xmlns='http://www.w3.org/2000/svg')
      g(:transform='`translate(${margin.left},${margin.top})`')
        tijdloze-axes(
          :x-scale='xScale'
          :y-scale='yScale'
          :years='years'
        )
        g(
          v-for='(song, index) in songs'
          :class="[\
            'line',\
            `color-${index}`,\
            {\
              highlighted: hoverIndex === index,\
              notHighlighted: hoverIndex !== null && hoverIndex !== index\
            }]"
          @mouseover='onHover(index)'
          @mouseleave='onHover(null)'
        )
          path.coloredPath(:d='fullSongLine(song)')
          circle.circle.coloredCircle(
            v-for='year in years'
            v-if='song.position(year)'
            :cx='xScale(year._yy)'
            :cy='yScale(song.position(year))'
            r='3'
          )

    .legend(v-if='!noLabel')
      div(
        v-for='(song, index) in songs'
        :key='song.id'
        :class="[\
          'songLegend',\
          `color-${index}`,\
          {\
          highlighted: hoverIndex === index\
          }]"
        @mouseover='onHover(index)'
        @mouseleave='onHover(null)'
      )
        | {{song.title}}

</template>

<script>
  import BaseGraph from './BaseGraph';
  import BaseGraphAxes from './BaseGraphAxes';
  import {possiblyInListIntervals} from '~/utils/intervals';

  export default {
    extends: BaseGraph,
    components: {
      TijdlozeAxes: BaseGraphAxes
    },
    props: ['songs', 'noLabel'],
    data() {
      return {
        hoverIndex: null
      }
    },
    methods: {
      onHover(index) {
        this.hoverIndex = index;
      },
      fullSongLine(song) {
        return this.songLine(
          song,
          possiblyInListIntervals([song], this.years)
        );
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/graphColors.less";

  div.graph {
    text-align: center;
    padding: 0;
    margin-bottom: 20px;

    svg {
      box-sizing: border-box;
      width: 100%;
      padding: 0 2em;
      background-color: white;
      font-size: 11px;

      .line {
        path {
          stroke-width: 1.5;
        }
        &.highlighted {
          path {
            stroke-width: 3;
          }
        }
        &.notHighlighted {
          opacity: 0.5;
        }
      }
    }
  }

  div.legend {
    div.songLegend {
      text-align: center;
      &.highlighted {
        font-weight: bold;
      }
    }
  }
</style>
