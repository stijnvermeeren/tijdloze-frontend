<template>
  <div>
    <h2>Artiest aanpassen</h2>
    <table class="info">
      <tbody>
        <tr>
          <th>Voornaam</th>
          <td><input v-model="fullArtistData.firstName" placeholder="The / Bob / ..." /></td>
        </tr>
        <tr>
          <th>Naam</th>
          <td><input v-model="fullArtistData.name" placeholder="Beatles / Dylan / ..." /></td>
        </tr>
        <tr>
          <th>Land</th>
          <td><country-input v-model="fullArtistData.countryId" /></td>
        </tr>
        <tr>
          <th>Opmerkingen</th>
          <td><textarea v-model="fullArtistData.notes" class="notes" /></td>
        </tr>
        <tr>
          <th>Officiële website</th>
          <td><official-url-input v-model="fullArtistData.urlOfficial" :query="`${artist.fullName} official`" /></td>
        </tr>
        <tr>
          <th>Wikipedia Nederlands</th>
          <td><wiki-url-input v-model="fullArtistData.urlWikiNl" lang="nl" :query="artist.fullName" /></td>
        </tr>
        <tr>
          <th>Wikipedia Engels</th>
          <td><wiki-url-input v-model="fullArtistData.urlWikiEn" lang="en" :query="artist.fullName" /></td>
        </tr>
        <tr>
          <th>AllMusic</th>
          <td><all-music-url-input v-model="fullArtistData.urlAllMusic" :query="artist.fullName" /></td>
        </tr>
        <tr>
          <th></th>
          <td><button @click="submit" :disabled="disabled">Aanpassen</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import WikiUrlInput from '../../../components/admin/WikiUrlInput'
  import CountryInput from '../../../components/admin/CountryInput'
  import AllMusicUrlInput from '../../../components/admin/AllMusicUrlInput'
  import OfficialUrlInput from '../../../components/admin/OfficialUrlInput'

  export default {
    components: {OfficialUrlInput, AllMusicUrlInput, CountryInput, WikiUrlInput},
    data() {
      return {
        processing: false
      }
    },
    computed: {
      artist() {
        return this.$store.getters['entities/artists']().find(this.fullArtistData.id);
      },
      disabled() {
        return this.processing || !this.fullArtistData.name || !this.fullArtistData.countryId
      }
    },
    methods: {
      submit() {
        this.processing = true;
        this.$axios.$put(`artist/${this.fullArtistData.id}`, this.fullArtistData).then(result => {
          this.fullArtistData = result;
          this.$store.dispatch("nuxtServerInit");
          this.processing = false;
        })
      }
    },
    async asyncData({ params, app }) {
      return {
        fullArtistData: await app.$axios.$get(`artist/${params.id}`)
      };
    },
    middleware: 'admin',
    head() {
      return {
        title: `Admin: Artist: ${this.artist.fullName}`
      }
    }
  }
</script>

<style lang="less" scoped>
  input, textarea {
    box-sizing: border-box;
    width: 100%;
  }

  textarea.notes {
    height: 60px;
  }
</style>
