<template lang="pug">
template(v-if="fullArtistData")
  Title Admin: Artist: {{fullArtistData.name}}
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
        admin-wikidata-input(v-model='fullArtistData.wikidataId' :query='fullArtistData.name')
    v-row(dense)
      v-col
        admin-artist-spotify-input(v-model='fullArtistData.spotifyId')
    v-row(dense)
      v-col
        admin-musicbrainz-input(
          v-model='fullArtistData.musicbrainzId'
          musicbrainz-category="artist"
          :query='fullArtistData.name'
        )
    v-row
      v-col
        admin-delete-btn(@click='submitDelete' :disabled='processing')
        v-btn(@click='submit' color="blue" :disabled='disabled') Aanpassen
</template>

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
const {$api} = useNuxtApp()

definePageMeta({
  middleware: 'admin'
})

const processing = ref(false)
const route = useRoute()
const artistId = useRouteParam('id', route)

const {data: fullArtistData} = await useApiFetch(apiEndpoints.artist.byId(Number(artistId)), { deep: true })

const disabled = computed(() => {
  return processing.value || !fullArtistData.value!.name
})

async function submit() {
  processing.value = true;
  await $api(apiEndpoints.artist.update(fullArtistData.value!.id), fullArtistData.value!)
  await navigateTo(`/artiest/${fullArtistData.value!.id}`);
}
async function submitDelete() {
  if (confirm("Deze artiest (en alle bijhorende nummers en albums) echt volledig verwijderen uit de database?")) {
    processing.value = true;
    await $api(apiEndpoints.artist.delete(fullArtistData.value!.id))
    await navigateTo(`/database`)
  }
}
</script>
