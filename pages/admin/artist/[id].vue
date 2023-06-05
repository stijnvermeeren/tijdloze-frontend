<template lang="pug">
Title Admin: Artist: {{this.fullName}}
div
  h2 Artiest aanpassen
  table.info
    tbody
      tr
        th Naam (prefix)
        td
          input(v-model='fullArtistData.namePrefix' placeholder='The / Bob / ...')
      tr
        th Naam
        td
          input(v-model='fullArtistData.name' placeholder='Beatles / Dylan / ...')
      tr
        th Aliases
        td
          input(v-model='fullArtistData.aliases' placeholder='De artiest wordt ook onder deze namen gevonden')
      tr
        th Land
        td
          country-input(v-model='fullArtistData.countryId')
      tr
        th Opmerkingen
        td
          textarea.notes(v-model='fullArtistData.notes')
      tr
        th Officiële website
        td
          official-url-input(v-model='fullArtistData.urlOfficial' :query='`${fullName} official`')
      tr
        th Wikipedia Nederlands
        td
          wiki-url-input(v-model='fullArtistData.urlWikiNl' lang='nl' :query='fullName')
      tr
        th Wikipedia Engels
        td
          wiki-url-input(v-model='fullArtistData.urlWikiEn' lang='en' :query='fullName')
      tr
        th AllMusic
        td
          all-music-url-input(v-model='fullArtistData.urlAllMusic' :query='fullName')
      tr
        th
        td
          el-button.deleteButton(@click='submitDelete' type="danger" icon="el-icon-delete" :disabled='processing')
          el-button(@click='submit' type="primary" :disabled='disabled') Aanpassen
</template>

<script>
  import WikiUrlInput from '../../../components/admin/WikiUrlInput'
  import CountryInput from '../../../components/admin/CountryInput'
  import AllMusicUrlInput from '../../../components/admin/AllMusicUrlInput'
  import OfficialUrlInput from '../../../components/admin/OfficialUrlInput'
  import {useApiFetchPut} from "~/composables/useApiFetchPut";

  export default defineNuxtComponent({
    setup() {
      definePageMeta({
        middleware: 'admin'
      })
    },
    components: {OfficialUrlInput, AllMusicUrlInput, CountryInput, WikiUrlInput},
    data() {
      return {
        processing: false
      }
    },
    computed: {
      disabled() {
        return this.processing || !this.fullArtistData.name
      },
      fullName() {
        if (this.fullArtistData.namePrefix) {
          return `${this.fullArtistData.namePrefix} ${this.fullArtistData.name}`
        } else {
          return this.fullArtistData.name;
        }
      }
    },
    methods: {
      async submit() {
        this.processing = true;
        await useApiFetchPut(`artist/${this.fullArtistData.id}`, this.fullArtistData)
        await useRouter().push(`/artiest/${this.fullArtistData.id}`);
      },
      async submitDelete() {
        if (confirm("Deze artiest (en alle bijhorende nummers en albums) echt volledig verwijderen uit de database?")) {
          this.processing = true;
          await useApiFetchDelete(`artist/${this.fullArtistData.id}`)
          await useRouter().push(`/database`)
        }
      }
    },
    async asyncData() {
      const {data: fullArtistData} = await useApiFetch(`artist/${useRoute().params.id}`)
      return {fullArtistData};
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
