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
      div.heading Album
      div.flex(v-for="album in candidateAlbums")
        span
          input(:id="`album-${album.id}`" type='radio' v-model='albumId' :value="album.id")
          label(:for="`album-${album.id}`") {{album.title}} ({{album.releaseYear}})
      div.flex
          input#album-new(type='radio' v-model='albumId' :value="undefined")
          label(for="album-new") Nieuw album
          div.flexGrow
            div.hint Titel
            input(v-model='albumDetails.title' placeholder="Titel")
          div
            div.hint Jaar
            input(v-model.number='albumDetails.releaseYear' type='number')
    div.flex(v-if='artistValid && albumValid')
      div.heading Nummer
      div.flexGrow
        div.hint Titel
        input(v-model='songDetails.title' placeholder="Titel")
      div
        div.hint Taal
        language-input(v-model='songDetails.languageId')
      div
        div.hint Lead vocals
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
  import _ from "lodash";

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
        if (!this.albumId) {
          return this.albumDetails.title && this.albumDetails.releaseYear;
        } else {
          return true;
        }
      },
      songValid() {
        return this.songDetails.title;
      },
      candidateAlbums() {
        if (!this.artistId) {
          return [];
        }

        const artist = this.$store.getters['entities/artists']().with('albums').find(this.artistId);
        if (artist) {
          return _.sortBy(
              artist.albums,
              [album => album.releaseYear, album => album.title]
          )
        } else {
          return [];
        }
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
      /*
       * An album matches if
       * - The artist matches
       * - The release year matches
       * - The titles match (case-insensitive) where one title is allowed to have some extra words.
       *   E.g. "Nevermind" matches with "Nevermind (Remastered)"
       *        BUT "Use Your Illusion I" does not match with "Use Your Illusion II"
       */
      albumMatch(artistId, albumName, releaseYear) {
        if (artistId && albumName && releaseYear) {
          const queryTokens = albumName.toLowerCase().split(" ");

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

        let albumId = this.albumId;
        if (!albumId) {
          const albumData = {
            artistId,
            title: this.albumDetails.title,
            releaseYear: this.albumDetails.releaseYear
          }
          const album = await this.$axios.$post('/album', albumData);
          albumId = album.id;
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

<style lang="less" scoped>
  div.box {
    border: 1px solid grey;
    padding: 5px 10px;
    margin: 10px 0;
  }

  .heading {
    font-weight: bold;
  }

  .flex {
    display: flex;
    margin:  5px 0;

    * {
      box-sizing: border-box;
    }

    >div {
      margin: 0 5px;

      &.flexGrow {
        flex-grow: 1;
      }

      div.hint {
        font-size: 60%;
        color: grey;
      }

      input {
        width: 100%;
      }
    }
  }
</style>
