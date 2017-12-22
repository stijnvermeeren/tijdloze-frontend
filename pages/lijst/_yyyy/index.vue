<template>
    <table class="list-summary">
        <tbody>
            <tr>
                <th>Hoogste nieuwkomer</th>
                <td>
                    <span v-if="highestNew">
                        <tijdloze-song :song="highestNew" /> - <tijdloze-artist :artist="$store.getters.artistsById[highestNew.artistId]" /> (<tijdloze-position :song="highestNew" :year="year" />) <span v-if="highestNew.isReEntry(year)">(re-entry)</span>
                    </span>
                    <span v-else>/</span>
                </td>
            </tr>
            <tr>
                <th>Grootste stijger</th>
                <td>
                    <span v-if="biggestUp">
                        <tijdloze-song :song="biggestUp" /> - <tijdloze-artist :artist="$store.getters.artistsById[biggestUp.artistId]" /> (<tijdloze-position :song="biggestUp" :year="year.previous()" /> &rarr; <tijdloze-position :song="biggestUp" :year="year" />)
                    </span>
                    <span v-else>/</span>
                </td>
            </tr>
            <tr>
                <th>Grootste daler</th>
                <td>
                    <span v-if="biggestDown">
                        <tijdloze-song :song="biggestDown" /> - <tijdloze-artist :artist="$store.getters.artistsById[biggestDown.artistId]" /> (<tijdloze-position :song="biggestDown" :year="year.previous()" /> &rarr; <tijdloze-position :song="biggestDown" :year="year" />)
                    </span>
                    <span v-else>/</span>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    import _ from 'lodash';

  export default {
    props: ["year", "songs", "newSongs"],
    computed: {
      highestNew() {
        return _.first(this.newSongs);
      },
      biggestUp() {
        return _.last(
          _.sortBy(
            this.songs.filter(song => {
              return song.position(this.year.previous()) && song.position(this.year) < song.position(this.year.previous());
            }),
            [song => song.position(this.year.previous()) - song.position(this.year), song => -song.position(this.year)]
          )
        );
      },
      biggestDown() {
        return _.last(
          _.sortBy(
            this.songs.filter(song => {
              return song.position(this.year.previous()) && song.position(this.year) > song.position(this.year.previous());
            }),
            [song => song.position(this.year) - song.position(this.year.previous()), song => -song.position(this.year)]
          )
        );
      }
    }
  }
</script>

<style lang="less" scoped>
    table.list-summary {
        th {
            width: 13em;
        }
    }
</style>
