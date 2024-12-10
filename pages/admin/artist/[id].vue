<template lang="pug">
Title Admin: Artist: {{this.fullArtistData.name}}
div
  h2 Artiest aanpassen

  v-container
    v-row(dense)
      v-col
        v-text-field(
          v-model='fullArtistData.name'
          placeholder='The Beatles / Bob Dylan / ...'
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
        admin-official-url-input(v-model='fullArtistData.urlOfficial' :query='`${fullArtistData.name} official`')
    v-row(dense)
      v-col
        admin-wiki-url-input(v-model='fullArtistData.urlWikiNl' lang='nl' :query='fullArtistData.name')
    v-row(dense)
      v-col
        admin-wiki-url-input(v-model='fullArtistData.urlWikiEn' lang='en' :query='fullArtistData.name')
    v-row(dense)
      v-col
        admin-all-music-url-input(v-model='fullArtistData.urlAllMusic' :query='fullArtistData.name')
    v-row(dense)
      v-col
        admin-artist-spotify-input(v-model='fullArtistData.spotifyId')
    v-row(dense)
      v-col
        admin-musicbrainz-input(
          v-model='fullArtistData.musicbrainzId'
          musicbrainz-category="artist"
        )
    v-row
      v-col
        admin-delete-btn(@click='submitDelete' :disabled='processing')
        v-btn(@click='submit' color="blue" :disabled='disabled') Aanpassen
</template>

<script>
  import useFetchOptsDelete from "~/composables/useFetchOptsDelete";

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
      }
    },
    methods: {
      async submit() {
        this.processing = true;
        await $fetch(`artist/${this.fullArtistData.id}`, useFetchOptsPut(this.fullArtistData))
        await navigateTo(`/artiest/${this.fullArtistData.id}`);
      },
      async submitDelete() {
        if (confirm("Deze artiest (en alle bijhorende nummers en albums) echt volledig verwijderen uit de database?")) {
          this.processing = true;
          await $fetch(`artist/${this.fullArtistData.id}`, useFetchOptsDelete())
          await navigateTo(`/database`)
        }
      }
    },
    async asyncData() {
      const fullArtistData = await $fetch(`artist/${useRoute().params.id}`, useFetchOpts())
      return {fullArtistData};
    }
  })
</script>
