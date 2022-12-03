<template lang="pug">
  div
    h2 Album aanpassen
    table.info
      tbody
        tr
          th Titel
          td
            input(v-model='fullAlbumData.title')
        tr
          th Artist
          td
            artist-select(v-model='fullAlbumData.artistId')
        tr
          th Jaar
          td
            input(v-model.number='fullAlbumData.releaseYear' type='number')
        tr
          th Opmerkingen
          td
            textarea.notes(v-model='fullAlbumData.notes')
        tr
          th Wikipedia Nederlands
          td
            wiki-url-input(v-model='fullAlbumData.urlWikiNl' lang='nl' :query='`${fullAlbumData.title} ${artist.fullName}`')
        tr
          th Wikipedia Engels
          td
            wiki-url-input(v-model='fullAlbumData.urlWikiEn' lang='en' :query='`${fullAlbumData.title} ${artist.fullName}`')
        tr
          th AllMusic
          td
            all-music-url-input(v-model='fullAlbumData.urlAllMusic' lang='nl' :query='`${fullAlbumData.title} ${artist.fullName}`')
        tr
          th
          td
            button(@click='submit' :disabled='disabled') Aanpassen
</template>

<script>
  import WikiUrlInput from '../../../components/admin/WikiUrlInput'
  import AllMusicUrlInput from '../../../components/admin/AllMusicUrlInput'
  import ArtistSelect from '../../../components/admin/ArtistSelect'
  import Artist from "@/orm/Artist";
  import Album from "@/orm/Album";

  export default {
    components: {ArtistSelect, AllMusicUrlInput, WikiUrlInput},
    data() {
      return {
        processing: false
      }
    },
    computed: {
      album() {
        return Album.find(this.fullAlbumData.id);
      },
      artist() {
        return Artist.find(this.fullAlbumData.artistId);
      },
      disabled() {
        return this.processing || !this.fullAlbumData.title || !this.fullAlbumData.artistId || !this.fullAlbumData.releaseYear
      }
    },
    methods: {
      submit() {
        this.processing = true;
        this.$axios.$put(`album/${this.fullAlbumData.id}`, this.fullAlbumData).then(result => {
          this.$router.push(`/album/${this.fullAlbumData.id}`);
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

<style lang="scss" scoped>
  textarea.notes {
    height: 60px;
  }
</style>
