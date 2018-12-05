<template>
    <div class="graph">
        <svg :viewBox="`0 0 ${fullWidth} ${fullHeight}`" xmlns="http://www.w3.org/2000/svg">
            <g :transform="`translate(${margin.left},${margin.top})`">
                <tijdloze-axes :xScale="xScale" :yScale="yScale" :years="years" />
                <g class="color-1">
                    <rect
                            v-for="point in points"
                            class="rect coloredRect"
                            :x="xScale(point.year._yy) - lineWidth(point.age) / 2"
                            :y="yScale(point.position) - yStep / 2"
                            :width="lineWidth(point.age)"
                            :height="yStep"
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
      computed: {
        yStep() {
          return this.yScale(1) - this.yScale(0);
        },
        points() {
          const years = this.$store.getters.years;
          const songs = this.$store.getters.songs;
          const points = [];
          years.forEach(year => {
            songs.forEach(song => {
              if (song.position(year)) {
                points.push({
                  year: year,
                  position: song.position(year),
                  age: year.yyyy - song.album.releaseYear
                });
              }
            })
          });

          return points;
        }
      },
      methods: {
        lineWidth(age) {
          return 1 + age / 2.5;
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
