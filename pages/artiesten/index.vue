<template>
    <div>
        <h2>Alle Tijdloze artiesten</h2>

        <tijdloze-tabs :tabs="[{ to: '/artiest', title: 'Artiesten' }, { to: '/nummers', title: 'Nummers' }]" selected="/artiest">
            <table class="lijst perVijf">
                <tbody>
                    <tr>
                        <th>Artiest</th>
                        <th></th>
                        <th>Nummers</th>
                    </tr>
                    <tr v-for="item in artistData">
                        <td>
                            <tijdloze-artist :artist="item.artist"></tijdloze-artist>
                        </td>
                        <td>
                            <tijdloze-country-icon :country="item.country"></tijdloze-country-icon>
                        </td>
                        <td class="s wrap">
                            <ul v-if="item.songs">
                                <li v-for="song in item.songs">
                                    <tijdloze-song :song="song"></tijdloze-song>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </tijdloze-tabs>
    </div>
</template>

<script>
  export default {
    computed: {
      artistData() {
        return this.$store.state.artists.map(artist => {
          return {
            artist: artist,
            country: this.$store.getters.countriesById[artist.countryId],
            songs: this.$store.getters.songsByArtistId(artist.id)
          };
        });
      }
    }
  }
</script>

<style scoped>

</style>
