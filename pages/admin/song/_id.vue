<template lang="pug">
  div
    h2 Nummer aanpassen
    table.info
      tbody
        tr
          th Titel
          td
            input(v-model='fullSongData.title')
        tr
          th Artist
          td
            artist-select(v-model='fullSongData.artistId')
        tr
          th Second artist
          td
            artist-select(v-model='fullSongData.secondArtistId' :required='false')
        tr
          th Album
          td
            album-select(v-model='fullSongData.albumId' :artist-id='fullSongData.artistId')
        tr
          th Taal
          td
            language-input(v-model='fullSongData.languageId')
        tr
          th Lead vocals
          td
            lead-vocals-input(v-model='fullSongData.leadVocals')
        tr
          th Lyrics
          td
            textarea.lyrics(v-model='fullSongData.lyrics')
        tr
          th Opmerkingen
          td
            textarea.notes(v-model='fullSongData.notes')
        tr
          th Wikipedia Nederlands
          td
            wiki-url-input(v-model='fullSongData.urlWikiNl' lang='nl' :query='`${fullSongData.title} ${artist.fullName}`')
        tr
          th Wikipedia Engels
          td
            wiki-url-input(v-model='fullSongData.urlWikiEn' lang='en' :query='`${fullSongData.title} ${artist.fullName}`')
        tr
          th Spotify ID
          td
            div
              input(v-model='fullSongData.spotifyId')
            div(v-if='fullSongData.spotifyId')
              spotify(:spotify-id='fullSongData.spotifyId')
        tr
          th
          td
            el-button.deleteButton(@click='submitDelete' type="danger" icon="el-icon-delete" :disabled='processing')
            el-button(@click='submit' type="primary" :disabled='disabled') Aanpassen
</template>

<script>
  import WikiUrlInput from '../../../components/admin/WikiUrlInput'
  import Spotify from '../../../components/Spotify'
  import LanguageInput from '../../../components/admin/LanguageInput'
  import LeadVocalsInput from '../../../components/admin/LeadVocalsInput'
  import ArtistSelect from '../../../components/admin/ArtistSelect'
  import AlbumSelect from '../../../components/admin/AlbumSelect'
  import Song from "@/orm/Song";
  import Artist from "@/orm/Artist";
  import Album from "@/orm/Album";

  export default {
    components: {AlbumSelect, ArtistSelect, LeadVocalsInput, LanguageInput, Spotify, WikiUrlInput},
    data() {
      return {
        processing: false
      }
    },
    computed: {
      artistId() {
        return this.fullSongData.artistId;
      },
      album() {
        return Album.find(this.fullSongData.albumId);
      },
      artist() {
        return Artist.find(this.fullSongData.artistId);
      },
      disabled() {
        return this.processing || !this.fullSongData.title || !this.fullSongData.artistId ||
          !this.fullSongData.albumId
      }
    },
    watch: {
      artistId() {
        this.fullSongData.albumId = undefined;
      }
    },
    methods: {
      submit() {
        this.processing = true;
        this.$axios.$put(`song/${this.fullSongData.id}`, this.fullSongData).then(result => {
          this.$router.push(`/nummer/${this.fullSongData.id}`);
        })
      },
      submitDelete() {
        if (confirm("Dit nummer echt volledig verwijderen uit de database?")) {
          this.processing = true;
          this.$axios.$delete(`song/${this.fullSongData.id}`).then(result => {
            this.$router.push(`/database`);
          })
        }
      }
    },
    async asyncData({ params, app }) {
      const fullSongData = await app.$axios.$get(`song/${params.id}`)
      return {
        fullSongData,
        title: fullSongData.title
      };
    },
    middleware: 'admin',
    head() {
      return {
        title: `Admin: Song: ${this.title}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  .deleteButton {
    float: right;
  }

  textarea.lyrics {
    height: 200px;
  }

  textarea.notes {
    height: 60px;
  }
</style>
