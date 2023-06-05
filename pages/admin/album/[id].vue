<template lang="pug">
Title Admin: Album: {{title}}
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
          el-button.deleteButton(@click='submitDelete' type="danger" icon="el-icon-delete" :disabled='processing')
          el-button(@click='submit' type="primary" :disabled='disabled') Aanpassen
</template>

<script>
  import WikiUrlInput from '../../../components/admin/WikiUrlInput'
  import AllMusicUrlInput from '../../../components/admin/AllMusicUrlInput'
  import ArtistSelect from '../../../components/admin/ArtistSelect'
  import Artist from "@/orm/Artist";
  import {useApiFetchPut} from "~/composables/useApiFetchPut";
  import {useRepo} from "pinia-orm";

  export default defineNuxtComponent({
    setup() {
      definePageMeta({
        middleware: 'admin'
      })
    },
    components: {ArtistSelect, AllMusicUrlInput, WikiUrlInput},
    data() {
      return {
        processing: false
      }
    },
    computed: {
      artist() {
        return useRepo(Artist).find(this.fullAlbumData.artistId);
      },
      disabled() {
        return this.processing || !this.fullAlbumData.title || !this.fullAlbumData.artistId || !this.fullAlbumData.releaseYear
      }
    },
    methods: {
      async submit() {
        this.processing = true;
        await useApiFetchPut(`album/${this.fullAlbumData.id}`, this.fullAlbumData)
        await useRouter().push(`/album/${this.fullAlbumData.id}`);
      },
      async submitDelete() {
        if (confirm("Dit album (en alle bijhorende nummers) echt volledig verwijderen uit de database?")) {
          this.processing = true;
          await useApiFetchDelete(`album/${this.fullAlbumData.id}`)
          await useRouter().push(`/database`);
        }
      }
    },
    async asyncData() {
      const {data: fullAlbumData} = await useApiFetch(`album/${useRoute().params.id}`)
      return {
        fullAlbumData,
        title: fullAlbumData.title
      };
    }
  })
</script>

<style lang="scss" scoped>
  .deleteButton {
    float: right;
  }

  textarea.notes {
    height: 60px;
  }
</style>
