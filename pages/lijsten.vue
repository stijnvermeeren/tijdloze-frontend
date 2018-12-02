<template>
    <div>
        <h2>Alle Tijdloze lijsten</h2>

        <div class="notabs">
            <table v-for="year in [...years].reverse()" :key="year.yyyy" class="lijst topvijflijst">
                <tbody>
                    <tr>
                        <th colspan="3" class="r">
                            <tijdloze-year :year="year" />
                        </th>
                    </tr>
                    <tr v-for="song in topFive(year)" :key="song.id">
                        <td class="r">
                            {{song.position(year)}}
                        </td>
                        <td>
                            <tijdloze-artist :artist="song.artist" />
                        </td>
                        <td>
                            <tijdloze-song :song="song" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
      computed: {
        years() {
          return this.$store.getters.years;
        }
      },
      methods: {
        topFive(year) {
          return _.take(this.$store.getters.list(year), 5);
        }
      },
      head: {
        title: 'Lijsten'
      }
    }
</script>
