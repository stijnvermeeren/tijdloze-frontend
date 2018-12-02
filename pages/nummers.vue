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
                    <tr v-for="song in songs" :key="song.id">
                        <td class="l">
                            <tijdloze-song :song="song" />
                        </td>
                        <td class="l">
                            <tijdloze-artist :artist="song.artist" />
                        </td>
                        <td>
                            {{song.album.releaseYear}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </tijdloze-tabs>
    </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    computed: {
      songs() {
        return this.$store.getters.songs;
      }
    },
    head: {
      title: 'Nummers'
    }
  }
</script>
