<template lang="pug">
Title Admin: Song: {{title}}
div
  h2 Nummer aanpassen
  v-container
    v-row(dense)
      v-col
        v-text-field(v-model='fullSongData.title' label="Titel" hide-details)
    v-row(dense)
      v-col
        v-text-field(
          v-model='fullSongData.aliases'
          label='Aliases (het nummer wordt ook onder deze titels gevonden)'
          hide-details
          density="compact"
        )
    v-row(dense)
      v-col
        admin-artist-select(v-model='fullSongData.artistId')
    v-row(dense)
      v-col
        admin-artist-select(v-model='fullSongData.secondArtistId' :required='false' label="Tweede artiest" density="compact")
    v-row(dense)
      v-col
        admin-album-select(v-model='fullSongData.albumId' :artist-id='fullSongData.artistId')
    v-row(dense)
      v-col
        admin-language-input(v-model='fullSongData.languageId')
    v-row(dense)
      v-col
        admin-lead-vocals-input(v-model='fullSongData.leadVocals')
    v-row(dense)
      v-col
        v-textarea(v-model='fullSongData.notes' label="Opmerkingen" rows="2" auto-grow hide-details)
    v-row(dense)
      v-col
        v-textarea(v-model='fullSongData.lyrics' label="Lyrics" rows="5" hide-details)
    v-row(dense)
      v-col
        admin-wiki-url-input(v-model='fullSongData.urlWikiNl' lang='nl' :query='`${fullSongData.title} ${artist.name}`')
    v-row(dense)
      v-col
        admin-wiki-url-input(v-model='fullSongData.urlWikiEn' lang='en' :query='`${fullSongData.title} ${artist.name}`')
    v-row(dense)
      v-col
        song-spotify-input(v-model='fullSongData.spotifyId' :artist="artist.name" :album="album.title" :title="fullSongData.title")
    v-row
      v-col
        admin-delete-btn(@click='submitDelete' :disabled='processing')
        v-btn(@click='submit' color="blue" :disabled='disabled') Aanpassen
</template>

<script>
  import Artist from "@/orm/Artist";
  import Album from "@/orm/Album";
  import {useRepo} from "pinia-orm";
  import SongSpotifyInput from "~/components/admin/SongSpotifyInput.vue";

  export default defineNuxtComponent({
    components: {SongSpotifyInput},
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
      artistId() {
        return this.fullSongData.artistId;
      },
      album() {
        return useRepo(Album).find(this.fullSongData.albumId);
      },
      artist() {
        return useRepo(Artist).find(this.fullSongData.artistId);
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
      async submit() {
        this.processing = true;
        await useApiFetchPut(`song/${this.fullSongData.id}`, this.fullSongData)
        await navigateTo(`/nummer/${this.fullSongData.id}`)
      },
      async submitDelete() {
        if (confirm("Dit nummer echt volledig verwijderen uit de database?")) {
          this.processing = true;
          await useApiFetchDelete(`song/${this.fullSongData.id}`)
          await useRouter().push(`/artiest/${this.fullSongData.artistId}`);
        }
      }
    },
    async asyncData() {
      const {data: fullSongData} = await useApiFetch(`song/${useRoute().params.id}`)
      return {
        fullSongData,
        title: fullSongData.title
      };
    }
  })
</script>
