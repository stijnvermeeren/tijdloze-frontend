<template>
    <table class="lijst perEen">
        <tbody>
            <tr>
                <th class="r">Jaar</th>
                <th>Aantal</th>
                <th>
                    <table class="valueDataDataValue">
                        <tbody>
                            <tr>
                                <th>Pos.</th>
                                <th class="a">
                                    <nuxt-link to="/artiesten">Artiest</nuxt-link>
                                </th>
                                <th>
                                    <nuxt-link to="/nummers">Nummer</nuxt-link>
                                </th>
                                <th>Definitief</th>
                            </tr>
                        </tbody>
                    </table>
                </th>
            </tr>
            <tr v-for="year in listYears">
                <td class="r"><tijdloze-year :year="year" /></td>
                <td>{{entriesPerYear(year).length}}</td>
                <td>
                    <table v-if="entriesPerYear(year).length" class="valueDataDataValue">
                        <tbody>
                            <tr v-for="entry in entriesPerYear(year)">
                                <td>{{entry.song.position(entry.year)}}</td>
                                <td class="a">
                                    <tijdloze-artist :artist="$store.getters.artistsById[entry.song.artistId]" />
                                </td>
                                <td>
                                    <tijdloze-song :song="entry.song" />
                                </td>
                                <td>
                                    <template v-if="entry.isFinal">*</template>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else>/</div>
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
        return _.reverse(_.drop(_.dropRight(this.years, 1), 1));
      }
    },
    methods: {
      entriesPerYear(year) {
        return _.sortBy(
          this.data.filter(entry => entry.year.equals(year)),
          entry => entry.song.position(entry.year)
        );
      }
    }
  }
</script>
