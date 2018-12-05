<template>
    <div class="graph">
        <svg :viewBox="`0 0 ${fullWidth} ${fullHeight}`" xmlns="http://www.w3.org/2000/svg">
            <g :transform="`translate(${margin.left},${margin.top})`">
                <tijdloze-axes :xScale="xScale" :yScale="yScale" :years="years" />
                <g
                        v-for="(song, index) in songs"
                        :class="[
                          'line',
                          `color-${index}`,
                          {
                            highlighted: hoverIndex === index,
                            notHighlighted: hoverIndex !== null && hoverIndex !== index
                          }]"
                        @mouseover="onHover(index)"
                        @mouseleave="onHover(null)"
                >
                    <path :d="fullSongLine(song)" class="coloredPath" />
                    <circle
                            v-for="year in years"
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

    export default {
      extends: BaseGraph,
      components: {
        TijdlozeAxes: BaseGraphAxes
      },
      props: ['songs', 'hoverIndex'],
      methods: {
        onHover(index) {
          this.$emit('hover', index);
        },
        fullSongLine(song) {
          return this.songLine(song, song.possiblyInListIntervals(this.years), true);
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
</style>
