<template lang="pug">
  div
    h4 Artiest
    div
      div
        span
          input#artist-existing(type='radio' v-model='artistType' value='existing')
          label(for='artist-existing') Bestaande artiest
        span
          input#artist-new(type='radio' v-model='artistType' value='new')
          label(for='artist-new') Nieuwe artiest
      .box
        div(v-if='!artistNew')
          artist-select(v-model='artistId')
        div(v-if='artistNew')
          table.info
            tbody
              tr
                th Voornaam
                td
                  input(v-model='artistDetails.namePrefix' placeholder='The / Bob / ...')
              tr
                th Naam
                td
                  input(v-model='artistDetails.name' placeholder='Beatles / Dylan / ...')
              tr
                th Land
                td
                  country-input(v-model='artistDetails.countryId')
    div(v-if='artistValid')
      h4 Album
      div
        span
          input#album-existing(type='radio' v-model='albumType' value='existing' :disabled="!artistId || artistType === 'new'")
          label(for='album-existing') Bestaand album
        span
          input#album-new(type='radio' v-model='albumType' value='new')
          label(for='album-new') Nieuw album
      .box
        div(v-if='!albumNew')
          album-select(v-model='albumId' :artist-id='artistId')
        div(v-if='albumNew')
          table.info
            tbody
              tr
                th Titel
                td
                  input(v-model='albumDetails.title')
              tr
                th Jaar
                td
                  input(v-model.number='albumDetails.releaseYear' type='number')
    div(v-if='artistValid && albumValid')
      h4 Nummer
      .box
        table.info
          tbody
            tr
              th Titel
              td
                input(v-model='songDetails.title')
            tr
              th Taal
              td
                language-input(v-model='songDetails.languageId')
            tr
              th Lead vocals
              td
                lead-vocals-input(v-model='songDetails.leadVocals')
    div
      button(:disabled='!(artistValid && albumValid && songValid) || submitting' @click='submit()') {{buttonLabel}}
</template>

<script>
  import CountryInput from './CountryInput'
  import ArtistSelect from './ArtistSelect'
  import AlbumSelect from './AlbumSelect'
  import LanguageInput from './LanguageInput'
  import LeadVocalsInput from './LeadVocalsInput'

  export default {
    name: 'NewSongWizard',
    components: {LeadVocalsInput, LanguageInput, AlbumSelect, ArtistSelect, CountryInput},
    props: {
      preset: {
        type: Object
      },
      buttonLabel: {
        type: String,
        default: "Toevoegen"
      }
    },
    data() {
      return this.initialData(this.preset);
    },
    computed: {
      artistNew() {
        return this.artistType === 'new';
      },
      albumNew() {
        return this.albumType === 'new';
      },
      album() {
        return this.$store.getters['entities/albums']().find(this.albumId);
      },
      artistValid() {
        if (this.artistNew) {
          return this.artistDetails.name;
        } else {
          return !! this.artistId;
        }
      },
      albumValid() {
        if (this.albumNew) {
          return this.albumDetails.title && this.albumDetails.releaseYear;
        } else {
          return !! this.albumId;
        }
      },
      songValid() {
        return this.songDetails.title;
      }
    },
    watch: {
      artistId() {
        this.checkAlbum();
      },
      artistType() {
        this.checkAlbum();
      },
      preset() {
        Object.assign(this.$data, this.initialData(this.preset));
      }
    },
    methods: {
      checkAlbum() {
        if (this.artistId && this.artistType === 'existing') {
          this.albumType = 'existing';
        } else {
          this.albumType = 'new';
        }

        if (this.albumId && this.album.artistId !== this.artistId) {
          this.albumId = undefined;
        }
      },
      initialData(preset) {
        const data = {
          artistType: 'new',
          artistId: undefined,
          artistDetails: {
            namePrefix: '',
            name: '',
            countryId: undefined
          },
          albumType: 'new',
          albumId: undefined,
          albumDetails: {
            title: '',
            releaseYear: undefined
          },
          songDetails: {
            title: '',
            languageId: undefined,
            leadVocals: undefined,
            spotifyId: undefined
          },
          submitting: false
        };

        if (preset) {
          const artist = this.artistMatch(preset.artistName);
          const album = artist
            ? this.albumMatch(artist.id, preset.albumTitle, preset.albumYear)
            : undefined;

          data.artistDetails.namePrefix = this.namePrefix(preset.artistName);
          data.artistDetails.name = this.name(preset.artistName);
          if (artist) {
            data.artistType = 'existing';
            data.artistId = artist.id;
          }

          data.albumDetails.title = preset.albumTitle;
          data.albumDetails.releaseYear = preset.albumYear;
          if (album) {
            data.albumType = 'existing';
            data.albumId = album.id;
          }

          data.songDetails.title = preset.songTitle;
          data.songDetails.spotifyId = preset.spotifyId;
        }

        return data;
      },
      preProcessArtistName(artistName) {
        let query = artistName.toLowerCase()
        if (query.substr(0,4) === 'the') {
          query = artistName.substr(4);
        }
        return query;
      },
      artistMatch(artistName) {
        if (artistName) {
          const query = this.preProcessArtistName(artistName);

          return this.$store.getters['entities/artists/query']().all().find(artist => {
            const matchName = this.preProcessArtistName(artist.fullName);
            return query === matchName;
          })
        } else {
          return undefined;
        }
      },
      albumMatch(artistId, albumName, releaseYear) {
        if (artistId && albumName && releaseYear) {
          const queryTokens = albumName.toLowerCase().split(" ");

          /*
           * An album matches if
           * - The artist matches
           * - The release year matches
           * - The titles match (case-insensitive) where one title is allowed to have some extra words.
           *   E.g. "Nevermind" matches with "Nevermind (Remastered)"
           *        BUT "Use Your Illusion I" does not match with "Use Your Illusion II"
           */
          return this.$store.getters['entities/albums/query']().all().find(album => {
            const matchTokens = album.title.toLowerCase().split(" ");
            const minLength = Math.min(queryTokens.length, matchTokens.length);
            return album.artistId === artistId &&
              queryTokens.slice(0, minLength).join(" ") === matchTokens.slice(0, minLength).join(" ") &&
              album.releaseYear === releaseYear;
          })
        } else {
          return undefined;
        }
      },
      namePrefix(fullName) {
        if (fullName && fullName.substr(0,4) === "The ") {
          return "The";
        } else {
          return "";
        }
      },
      name(fullName) {
        if (fullName && fullName.substr(0,4) === "The ") {
          return fullName.substr(4);
        } else {
          return fullName;
        }
      },
      async submit() {
        this.submitting = true;

        let artistId = undefined;
        if (this.artistNew) {
          const artistData = {
            namePrefix: this.artistDetails.namePrefix,
            name: this.artistDetails.name,
            countryId: this.artistDetails.countryId
          }
          const artist = await this.$axios.$post('/artist', artistData);
          artistId = artist.id;
        } else {
          artistId = this.artistId;
        }

        let albumId = undefined;
        if (this.albumNew) {
          const albumData = {
            artistId,
            title: this.albumDetails.title,
            releaseYear: this.albumDetails.releaseYear
          }
          const album = await this.$axios.$post('/album', albumData);
          albumId = album.id;
        } else {
          albumId = this.albumId;
        }

        const songData = {
          artistId,
          albumId,
          title: this.songDetails.title,
          languageId: this.songDetails.languageId,
          leadVocals: this.songDetails.leadVocals,
          spotifyId: this.songDetails.spotifyId
        }
        const song = await this.$axios.$post('/song', songData);

        this.submitting = false;
        Object.assign(this.$data, this.initialData());
        this.$emit('newSong', song);
      }
    }
  }
</script>

<style scoped>
  div.box {
    border: 1px solid grey;
    padding: 5px 10px;
    margin: 10px 0;
  }
</style>
