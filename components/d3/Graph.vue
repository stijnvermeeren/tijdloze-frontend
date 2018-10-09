<template>
    <div class="graph">
        <svg :width="fullWidth" :height="fullHeight">
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
            height: 400px;
            width: 750px;
            background-color: white;
            font-size: 11px;

            .line {
                path {
                    stroke-width: 1.5px;
                }
                &.highlighted {
                    path {
                        stroke-width: 3px;
                    }
                }
                &.notHighlighted {
                    opacity: 0.5;
                }
            }
        }
    }
</style>
