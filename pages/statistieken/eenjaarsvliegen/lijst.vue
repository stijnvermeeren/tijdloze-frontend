<template>
    <table class="lijst perVijf">
        <tbody>
            <tr>
                <th></th>
                <th>Jaar</th>
                <th class="a"><nuxt-link to="/artiesten">Artiest</nuxt-link></th>
                <th><nuxt-link to="/nummers">Nummer</nuxt-link></th>
                <th>Plaats</th>
                <th>Definitief</th>
            </tr>
            <tr v-for="{entry, position} in ranking">
                <td class="r">{{position}}</td>
                <td><tijdloze-year :year="entry.year" /></td>
                <td class="a"><tijdloze-artist :artist="entry.song.artist" /></td>
                <td><tijdloze-song :song="entry.song" /></td>
                <td>{{entry.song.position(entry.year)}}</td>
                <td>
                    <template v-if="entry.isFinal">*</template>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
  import ranking from '../../../store/ranking';

  export default {
    props: ['data', 'years'],
    computed: {
      ranking() {
        return ranking(
          this.data,
          ({song, year}) => song.position(year),
          ({year}) => year.yyyy,
          50
        );
      }
    }
  }
</script>
