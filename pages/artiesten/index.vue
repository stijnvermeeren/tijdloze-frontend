<template>
    <div>
        <h2>Alle Tijdloze artiesten</h2>

        <tijdloze-tabs :tabs="[
          { to: '/artiesten', title: 'Artiesten' },
          { to: '/nummers', title: 'Nummers' }
        ]">
            <table class="lijst perVijf">
                <tbody>
                    <tr>
                        <th>Artiest</th>
                        <th></th>
                        <th>Nummers</th>
                    </tr>
                    <tr v-for="{artist, country, songs} in artistData">
                        <td>
                            <tijdloze-artist :artist="artist"></tijdloze-artist>
                        </td>
                        <td>
                            <tijdloze-country-icon :country="country"></tijdloze-country-icon>
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
        </tijdloze-tabs>
    </div>
</template>

<script>
  export default {
    computed: {
      artistData() {
        return this.$store.getters.artists.map(artist => {
          return {
            artist: artist,
            country: this.$store.getters.countriesById[artist.countryId],
            songs: this.$store.getters.songsByArtistId(artist.id)
          };
        });
      }
    },
    head: {
      title: 'Artiesten'
    }
  }
</script>
