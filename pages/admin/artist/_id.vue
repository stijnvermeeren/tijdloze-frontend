<template lang="pug">
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
            button(@click='submit' :disabled='disabled') Aanpassen
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
      submit() {
        this.processing = true;
        this.$axios.$put(`artist/${this.fullArtistData.id}`, this.fullArtistData).then(result => {
          this.fullArtistData = result;
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
        title: `Admin: Artist: ${this.fullName}`
      }
    }
  }
</script>

<style lang="less" scoped>
  textarea.notes {
    height: 60px;
  }
</style>
