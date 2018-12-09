<template>
  <div>
    <h2>Nummer aanpassen</h2>
    <table class="info">
      <tbody>
        <tr>
          <th>Titel</th>
          <td><input v-model="fullSongData.title" /></td>
        </tr>
        <tr>
          <th>Artist</th>
          <td>{{song.artist.fullName}}</td>
        </tr>
        <tr>
          <th>Album</th>
          <td>{{song.album.title}} ({{song.album.releaseYear}})</td>
        </tr>
        <tr>
          <th>Taal</th>
          <td><language-input v-model="fullSongData.languageId" /></td>
        </tr>
        <tr>
          <th>Lead vocals</th>
          <td><lead-vocals-input v-model="fullSongData.leadVocals" /></td>
        </tr>
        <tr>
          <th>Lyrics</th>
          <td><textarea v-model="fullSongData.lyrics" class="lyrics" /></td>
        </tr>
        <tr>
          <th>Opmerkingen</th>
          <td><textarea v-model="fullSongData.notes" class="notes" /></td>
        </tr>
        <tr>
          <th>Wikipedia Nederlands</th>
          <td><wiki-url-input v-model="fullSongData.urlWikiNl" lang="nl" :query="`${fullSongData.title} ${song.artist.fullName}`" /></td>
        </tr>
        <tr>
          <th>Wikipedia Engels</th>
          <td><wiki-url-input v-model="fullSongData.urlWikiEn" lang="en" :query="`${fullSongData.title} ${song.artist.fullName}`" /></td>
        </tr>
        <tr>
          <th>Spotify ID</th>
          <td>
            <div><input v-model="fullSongData.spotifyId" /></div>
            <div v-if="fullSongData.spotifyId">
              <spotify :spotify-id="fullSongData.spotifyId" />
            </div>
          </td>
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
  import Spotify from '../../../components/Spotify'
  import LanguageInput from '../../../components/admin/LanguageInput'
  import LeadVocalsInput from '../../../components/admin/LeadVocalsInput'

  export default {
    components: {LeadVocalsInput, LanguageInput, Spotify, WikiUrlInput},
    data() {
      return {
        processing: false
      }
    },
    computed: {
      song() {
        return this.$store.getters['entities/songs']().withAll().find(this.fullSongData.id);
      },
      disabled() {
        return this.processing || !this.fullSongData.title || !this.fullSongData.artistId ||
          !this.fullSongData.albumId || !this.fullSongData.languageId || !this.fullSongData.leadVocals
      }
    },
    methods: {
      submit() {
        this.processing = true;
        this.$axios.$put(`song/${this.fullSongData.id}`, this.fullSongData).then(result => {
          this.fullSongData = result;
          this.$store.dispatch("nuxtServerInit");
          this.processing = false;
        })
      }
    },
    async asyncData({ params, app }) {
      return {
        fullSongData: await app.$axios.$get(`song/${params.id}`)
      };
    },
    middleware: 'admin',
    head() {
      return {
        title: `Admin: Song: ${this.song.title}`
      }
    }
  }
</script>

<style lang="less" scoped>
  input, textarea {
    box-sizing: border-box;
    width: 100%;
  }

  textarea.lyrics {
    height: 200px;
  }

  textarea.notes {
    height: 60px;
  }
</style>
