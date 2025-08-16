<template lang="pug">
Title Admin: Album: {{title}}
div
  h2 Album aanpassen

  v-container
    v-row(dense)
      v-col
        v-text-field(v-model='fullAlbumData.title' label="Title" hide-details)
    v-row.align-center(dense)
      v-col
        admin-artist-select(v-model='fullAlbumData.artistId')
    v-row(dense)
      v-col
        v-text-field(v-model.number='fullAlbumData.releaseYear' type='number' label="Jaar" hide-details)
      v-col
        v-checkbox(v-model='fullAlbumData.isSingle' label="Single" hide-details)
      v-col
        v-checkbox(v-model='fullAlbumData.isSoundtrack' label="Soundtrack" hide-details)
    v-row(dense)
      v-col
        v-textarea.notes(v-model='fullAlbumData.notes' label="Opmerkingen" hide-details auto-grow rows="2")
    v-row(dense)
      v-col
        admin-wiki-url-input(
          v-model='fullAlbumData.urlWikiNl'
          lang='nl'
          :query='`${fullAlbumData.title} ${artist.name}`'
        )
    v-row(dense)
      v-col
        admin-wiki-url-input(
          v-model='fullAlbumData.urlWikiEn'
          lang='en'
          :query='`${fullAlbumData.title} ${artist.name}`'
        )
    v-row(dense)
      v-col
        admin-all-music-url-input(
          v-model='fullAlbumData.urlAllMusic'
          :query='`${fullAlbumData.title} ${artist.name}`'
        )
    v-row(dense)
      v-col
        admin-musicbrainz-input(
          v-model='fullAlbumData.musicbrainzId'
          musicbrainz-category="release-group"
          :query='`${fullAlbumData.title} ${artist.name}`'
        )
    v-row(dense)
      v-col
        admin-wikidata-input(v-model='fullAlbumData.wikidataId' :query='`${fullAlbumData.title} ${artist.name}`')
    v-row
      v-col
        admin-delete-btn(@click='submitDelete' :disabled='processing')
        v-btn(@click='submit' color="blue" :disabled='disabled') Aanpassen
</template>

<script setup>
  import Artist from "~/orm/Artist";
  import {useRepo} from "pinia-orm";

  const {$api} = useNuxtApp()

  definePageMeta({
    middleware: 'admin'
  })

  const processing = ref(false)

  const {data: fullAlbumData} = await useFetch(`album/${useRoute().params.id}`, useFetchOpts())
  const title = ref(fullAlbumData.value.title)  // not reactive

  const artist = computed(() => {
    return useRepo(Artist).find(fullAlbumData.value.artistId);
  })
  const disabled = computed(() => {
    return processing.value || !fullAlbumData.value.title || !fullAlbumData.value.artistId || !fullAlbumData.value.releaseYear
  })

  async function submit() {
    processing.value = true;
    await $api(`album/${fullAlbumData.value.id}`, useFetchOptsPut(fullAlbumData.value))
    await useRouter().push(`/album/${fullAlbumData.value.id}`);
  }

  async function submitDelete() {
    if (confirm("Dit album (en alle bijhorende nummers) echt volledig verwijderen uit de database?")) {
      processing.value = true;
      await $api(`album/${fullAlbumData.value.id}`, useFetchOptsDelete())
      await useRouter().push(`/artiest/${fullAlbumData.value.artistId}`);
    }
  }
</script>
