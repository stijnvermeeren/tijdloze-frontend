<template>
    <div>
        <h2>Artiesten: {{this.country.name}}</h2>

        <table class="lijst perVijf">
            <tbody>
                <tr>
                    <th>Artiest</th>
                    <th>Nummers</th>
                </tr>
                <tr v-for="{artist, country, songs} in artistData">
                    <td>
                        <tijdloze-artist :artist="artist"></tijdloze-artist>
                    </td>
                    <td class="s wrap">
                        <ul v-if="songs.length">
                            <li v-for="song in songs">
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
      artistData() {
        return this.$store.getters.artists
          .filter(artist => artist.countryId === this.country.id)
          .map(artist => {
              return {
                artist: artist,
                songs: this.$store.getters.songsByArtistId(artist.id)
              };
            });
      }
    },
    head() {
      return {
        title: `Artiesten: ${this.country.name}`
      }
    }
  }
</script>
