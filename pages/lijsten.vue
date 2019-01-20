<template lang="pug">
  div
    h2 Alle Tijdloze lijsten
    table.lijst.topvijflijst(v-for='year in [...years].reverse()' :key='year.yyyy')
      tbody
        tr
          th.r(colspan='3')
            tijdloze-year(:year='year')
        tr(v-for='song in topFive(year)' :key='song.id')
          td.r
            | {{song.position(year)}}
          td
            tijdloze-artist(:artist='song.artist')
          td
            tijdloze-song(:song='song')
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
