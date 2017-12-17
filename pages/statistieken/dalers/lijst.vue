<template>
    <table class="lijst perVijf">
        <tbody>
            <tr>
                <th></th>
                <th>Jaar</th>
                <th class="a"><nuxt-link to="/artiesten">Artiest</nuxt-link></th>
                <th><nuxt-link to="/nummers">Nummer</nuxt-link></th>
                <th colspan="2">Gestegen</th>
            </tr>
            <tr v-for="{entry, position} in ranking">
                <td class="r">{{position}}</td>
                <td><tijdloze-year :year="entry.year" /></td>
                <td class="a"><tijdloze-artist :artist="$store.getters.artistsById[entry.song.artistId]" /></td>
                <td><tijdloze-song :song="entry.song" /></td>
                <td>{{entry.newPosition - entry.oldPosition}} posities</td>
                <td class="i">{{entry.oldPosition}} &rarr; {{entry.newPosition}}</td>
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
          ({oldPosition, newPosition}) => oldPosition - newPosition,
          [({newPosition}) => newPosition, ({year}) => year.yyyy],
          50
        );
      }
    }
  }
</script>
