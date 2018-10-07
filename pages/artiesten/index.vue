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
                    <tr v-for="artist in artists">
                        <td>
                            <tijdloze-artist :artist="artist"></tijdloze-artist>
                        </td>
                        <td>
                            <tijdloze-country-icon :country="countries[artist.countryId]"></tijdloze-country-icon>
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
        </tijdloze-tabs>
    </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    computed: {
      artists() {
        return this.$store.getters['entities/artists/query']().with('songs').all();
      },
      countries() {
        return this.$store.getters.countriesById;
      }
    },
    head: {
      title: 'Artiesten'
    }
  }
</script>
