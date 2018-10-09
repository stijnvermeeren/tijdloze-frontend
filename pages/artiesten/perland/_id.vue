<template>
    <div>
        <h2>Artiesten: {{this.country.name}}</h2>

        <table class="lijst perVijf">
            <tbody>
                <tr>
                    <th>Artiest</th>
                    <th>Nummers</th>
                </tr>
                <tr v-for="artist in artists">
                    <td>
                        <tijdloze-artist :artist="artist"></tijdloze-artist>
                    </td>
                    <td class="s wrap">
                        <ul v-if="artist.songs.length">
                            <li v-for="song in artist.songs">
                                <tijdloze-song :song="song"></tijdloze-song>
                            </li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
  export default {
    computed: {
      country() {
        return this.$store.getters.countriesById[this.$route.params.id];
      },
      artists() {
        return this.$store.getters['entities/artists']()
          .with('songs')
          .where(artist => artist.countryId === this.country.id)
          .all();
      }
    },
    head() {
      return {
        title: `Artiesten: ${this.country.name}`
      }
    }
  }
</script>
