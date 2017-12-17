<template>
    <table class="lijst perVijf">
        <tbody>
            <tr>
                <th class="r">Jaar</th>
                <th>Aantal</th>
                <th class="l" colspan="4">Grootste stijger</th>
            </tr>
            <tr v-for="year in listYears">
                <td class="r"><tijdloze-year :year="year" /></td>
                <td>{{entriesPerYear(year).length}}</td>

                <td v-if="topEntry(year)">
                    {{topEntry(year).oldPosition - topEntry(year).newPosition}} posities
                </td>
                <td v-if="topEntry(year)" class="i">
                    {{topEntry(year).oldPosition}} &rarr; {{topEntry(year).newPosition}}
                </td>
                <td v-if="topEntry(year)" class="a">
                    <tijdloze-artist :artist="$store.getters.artistsById[topEntry(year).song.artistId]" />
                </td>
                <td v-if="topEntry(year)">
                    <tijdloze-song :song="topEntry(year).song" />
                </td>
                <td v-if="!topEntry(year)" class="l" colspan="4">
                    /
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
  import _ from 'lodash'

  export default {
    props: ['data', 'years'],
    computed: {
      listYears() {
        return _.reverse(_.drop(this.years, 1));
      }
    },
    methods: {
      entriesPerYear(year) {
        return _.sortBy(
          this.data.filter(entry => entry.year.equals(year)),
          [entry => entry.newPosition - entry.oldPosition, entry => entry.newPosition]
        );
      },
      topEntry(year) {
        return _.first(this.entriesPerYear(year));
      }
    }
  }
</script>
