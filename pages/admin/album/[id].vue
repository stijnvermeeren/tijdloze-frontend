<template lang="pug">
Title Admin: Album: {{title}}
div
  h2 Album aanpassen

  v-container
    v-row(dense)
      v-col
        v-text-field(v-model='fullAlbumData.title' label="Title" hide-details)
    v-row(dense)
      v-col Artist
      v-col
        admin-artist-select(v-model='fullAlbumData.artistId')
    v-row(dense)
      v-col
        v-text-field(v-model.number='fullAlbumData.releaseYear' type='number' label="Jaar" hide-details)
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
        )
    v-row
      v-col
        admin-delete-btn(@click='submitDelete' :disabled='processing')
        v-btn(@click='submit' color="blue" :disabled='disabled') Aanpassen
</template>

<script>
  import Artist from "@/orm/Artist";
  import {useRepo} from "pinia-orm";

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
          await useRouter().push(`/artiest/${this.fullAlbumData.artistId}`);
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
