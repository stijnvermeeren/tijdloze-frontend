<template>
    <div>
        <h2>Alle Tijdloze nummers</h2>

        <tijdloze-tabs :tabs="[
          { to: '/artiesten', title: 'Artiesten' },
          { to: '/nummers', title: 'Nummers' }
        ]">
            <table class="lijst perVijf">
                <tbody>
                    <tr>
                        <th class="l">Nummer</th>
                        <th class="l"><nuxt-link to="/artiesten">Artiest</nuxt-link></th>
                        <th>Jaar</th>
                    </tr>
                    <tr v-for="data in songData">
                        <td class="l">
                            <tijdloze-song :song="data.song" />
                        </td>
                        <td class="l">
                            <tijdloze-artist :artist="data.artist" />
                        </td>
                        <td>
                            {{data.song.releaseYear}}
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
      songData() {
        return this.$store.getters.songs.map(song => {
          return {
            artist: this.$store.getters.artistsById[song.artistId],
            song
          };
        });
      }
    },
    head: {
      title: 'Nummers'
    }
  }
</script>
