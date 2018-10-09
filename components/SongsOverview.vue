<template>
    <div>
        <table class="lijst">
            <tbody>
            <tr>
                <th></th>
                <th class="l">Nummer</th>
                <th class="y">Jaar</th>
                <th class="l">In de Tijdloze</th>
                <th v-for="year in lastTwoYears">{{year._yy}}</th>
            </tr>
            <tr
                    v-for="(song, index) in songs"
                    :class="[{
                                  notHighlighted: hoverIndex !== null && index !== hoverIndex,
                                  inCurrentList: song.possiblyInList(currentYear)
                                }]"
                    @mouseover="onHover(index)"
                    @mouseleave="onHover(null)"
            >
                <td>
                    <color-label :index="index" />
                </td>
                <td class="l">
                    <tijdloze-song :song="song" />
                </td>
                <td class="y">
                    {{song.album.releaseYear}}
                </td>
                <td class="l">
                                <span v-if="song.listCount(years)">
                                    {{song.listCount(years)}} {{song.listCount(years) > 1 ? 'noteringen' : 'notering'}}
                                    ({{inListSummary(song)}})
                                </span>
                    <span v-else>Geen top-100 noteringen</span>
                </td>
                <td v-for="year in lastTwoYears">
                    <tijdloze-position-change :song="song" :year="year" /> <tijdloze-position :song="song" :year="year" />
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
  import _ from 'lodash';
  import ColorLabel from "./d3/ColorLabel";

  export default {
    components: {
      ColorLabel
    },
    props: ['songs', 'hoverIndex'],
    computed: {
      years() {
        return this.$store.getters.years;
      },
      currentYear() {
        return this.$store.getters.currentYear;
      },
      lastTwoYears() {
        return _.takeRight(this.years, 2);
      }
    },
    methods: {
      onHover(index) {
        this.$emit('hover', index);
      },
      inListSummary(song) {
        const intervalSummaries = song.possiblyInListIntervals(this.years).map(interval => {
          const first = _.first(interval);
          const last = _.last(interval);
          if (last.isCurrent()) {
            return `${first._yy}-...`
          } else if (first.equals(last)) {
            return first._yy
          } else {
            return `${first._yy}-${last._yy}`
          }
        });
        return intervalSummaries.join(", ");
      }
    }
  }
</script>

<style lang="less" scoped>
    tr.notHighlighted {
        opacity: 0.3;
    }
</style>
