<template lang="pug">
Title Admin: Artist: {{this.fullName}}
div
  h2 Artiest aanpassen

  v-container
    v-row(dense)
      v-col
        v-text-field(
          v-model='fullArtistData.namePrefix'
          placeholder='The / Bob / ...'
          label="Naam (prefix)"
          hide-details
        )
      v-col
        v-text-field(
          v-model='fullArtistData.name'
          placeholder='Beatles / Dylan / ...'
          label="Naam"
          hide-details
        )
    v-row(dense)
      v-col
        v-text-field(
          v-model='fullArtistData.aliases'
          label="Alias (de artiest wordt ook onder deze namen gevonden)"
          hide-details
        )
    v-row(dense)
      v-col
        admin-country-input(v-model='fullArtistData.countryId')
    v-row(dense)
      v-col
        v-textarea(v-model='fullArtistData.notes' label="Opmerkingen" rows="2" auto-grow hide-details)
    v-row(dense)
      v-col
        admin-official-url-input(v-model='fullArtistData.urlOfficial' :query='`${fullName} official`')
    v-row(dense)
      v-col
        admin-wiki-url-input(v-model='fullArtistData.urlWikiNl' lang='nl' :query='fullName')
    v-row(dense)
      v-col
        admin-wiki-url-input(v-model='fullArtistData.urlWikiEn' lang='en' :query='fullName')
    v-row(dense)
      v-col
        admin-all-music-url-input(v-model='fullArtistData.urlAllMusic' :query='fullName')
    v-row(dense)
      v-col
        admin-artist-spotify-input(v-model='fullArtistData.spotifyId')
    v-row
      v-col
        admin-delete-btn(@click='submitDelete' :disabled='processing')
        v-btn(@click='submit' color="blue" :disabled='disabled') Aanpassen
</template>

<script>
  import {useApiFetchPut} from "~/composables/useApiFetchPut";

  export default defineNuxtComponent({
    setup() {
      definePageMeta({
        middleware: 'admin'
      })
    },
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
        await navigateTo(`/artiest/${this.fullArtistData.id}`);
      },
      async submitDelete() {
        if (confirm("Deze artiest (en alle bijhorende nummers en albums) echt volledig verwijderen uit de database?")) {
          this.processing = true;
          await useApiFetchDelete(`artist/${this.fullArtistData.id}`)
          await navigateTo(`/database`)
        }
      }
    },
    async asyncData() {
      const {data: fullArtistData} = await useApiFetch(`artist/${useRoute().params.id}`)
      return {fullArtistData};
    }
  })
</script>
