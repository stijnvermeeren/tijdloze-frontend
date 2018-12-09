<template>
  <div>
    <h2>Album aanpassen</h2>
    <table class="info">
      <tbody>
        <tr>
          <th>Titel</th>
          <td><input v-model="fullAlbumData.title" /></td>
        </tr>
        <tr>
          <th>Artist</th>
          <td>{{album.artist.fullName}}</td>
        </tr>
        <tr>
          <th>Jaar</th>
          <td><input v-model="fullAlbumData.releaseYear" /></td>
        </tr>
        <tr>
          <th>Opmerkingen</th>
          <td><textarea v-model="fullAlbumData.notes" class="notes" /></td>
        </tr>
        <tr>
          <th>Wikipedia Nederlands</th>
          <td><wiki-url-input v-model="fullAlbumData.urlWikiNl" lang="nl" :query="`${fullAlbumData.title} ${album.artist.fullName}`" /></td>
        </tr>
        <tr>
          <th>Wikipedia Engels</th>
          <td><wiki-url-input v-model="fullAlbumData.urlWikiEn" lang="en" :query="`${fullAlbumData.title} ${album.artist.fullName}`" /></td>
        </tr>
        <tr>
          <th>Wikipedia Nederlands</th>
          <td><all-music-url-input v-model="fullAlbumData.urlAllMusic" lang="nl" :query="`${fullAlbumData.title} ${album.artist.fullName}`" /></td>
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
  import AllMusicUrlInput from '../../../components/admin/AllMusicUrlInput'

  export default {
    components: {AllMusicUrlInput, WikiUrlInput},
    data() {
      return {
        processing: false
      }
    },
    computed: {
      album() {
        return this.$store.getters['entities/albums']().withAll().find(this.fullAlbumData.id);
      },
      disabled() {
        return this.processing || !this.fullAlbumData.title || !this.fullAlbumData.artistId || !this.fullAlbumData.releaseYear
      }
    },
    methods: {
      submit() {
        this.processing = true;
        this.$axios.$put(`album/${this.fullAlbumData.id}`, this.fullAlbumData).then(result => {
          this.fullAlbumData = result;
          this.$store.dispatch("nuxtServerInit");
          this.processing = false;
        })
      }
    },
    async asyncData({ params, app }) {
      return {
        fullAlbumData: await app.$axios.$get(`album/${params.id}`)
      };
    },
    middleware: 'admin',
    head() {
      return {
        title: `Admin: Album: ${this.album.title}`
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
