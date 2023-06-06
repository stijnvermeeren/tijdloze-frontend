<template lang="pug">
div
  div
    div.heading Artiest
    div.indent
      el-radio-group(v-model="artistType" size="small")
        el-radio-button(label="existing") Artiest uit de database
        el-radio-button(label="new") Nieuwe artiest
      div(v-if="artistType === 'existing'")
        admin-artist-select(v-model='artistId')
      div(v-else)
        div.flex
          div.hint Voornaam
          div.input
            el-input(v-model='artistDetails.namePrefix' placeholder='The / Bob / ...')
        div.flex
          div.hint Naam
          div.input
            el-input(v-model='artistDetails.name' placeholder='Beatles / Dylan / ...')
        div.flex
          div.hint Land
          div.input
            admin-country-input(v-model='artistDetails.countryId')
  div(v-if='artistValid')
    div.heading Album
    div.indent
      label.flex(v-for="album in candidateAlbums" :for="`album-${album.id}`")
        input(:id="`album-${album.id}`" type='radio' v-model='albumId' :value="album.id")
        div.flex
          div {{album.title}} ({{album.releaseYear}})
      label.flex(for="album-new")
        input#album-new(type='radio' v-model='albumId' :value="undefined")
        div.flex.flexGrow
          div Nieuw album
          div.flex
            div.hint Titel
            el-input(v-model='albumDetails.title' placeholder="Titel" :disabled="!!albumId")
          div.flex
            div.hint Jaar
            el-input-number(v-model='albumDetails.releaseYear' :disabled="!!albumId")
  div.heading Nummer
  div.indent
    div(v-if='artistValid && albumValid')
      div.flex
        div.hint Titel
        div.input
          el-input(v-model='songDetails.title' placeholder="Titel")
      div.flex
        div.hint Taal
        div.input
          admin-language-input(v-model='songDetails.languageId')
      div.flex
        div.hint Lead vocals
        div.input
          admin-lead-vocals-input(v-model='songDetails.leadVocals')
    div.otherArtistSongs(v-if="otherArtistSongs.length")
      | Opgelet! Reeds gekende nummers van deze artist:
      span(v-for="song in otherArtistSongs")
        | {{song.title}}
  div
    el-button(
      type="primary"
      round
      :disabled='!(artistValid && albumValid && songValid) || submitting'
      @click='submit()'
    ) {{buttonLabel}}
</template>

<script>
  import _ from "lodash";
  import Album from "@/orm/Album";
  import Artist from "@/orm/Artist";
  import {normalize} from "@/utils/string";
  import {useRepo} from "pinia-orm";

  export default {
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
      otherArtistSongs() {
        if (this.artistNew || !this.artistId) {
          return []
        }
        const artist = useRepo(Artist).withAll().find(this.artistId)
        if (!artist) {
          return []
        }

        return artist.songs
      },
      album() {
        return useRepo(Album).find(this.albumId);
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
        if (!this.artistId || this.artistType === 'new') {
          return [];
        }

        const artist = Artist.query().with('albums').find(this.artistId);
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
        let query = normalize(artistName.toLowerCase());
        if (query.substring(0,4) === 'the') {
          query = artistName.substring(4);
        }
        return query;
      },
      artistMatch(artistName) {
        if (artistName) {
          const query = this.preProcessArtistName(artistName);

          return Artist.all().find(artist => {
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
       * - The titles match (case-insensitive) where one title is allowed to have some extra words. Punctuation is
       *   ignored.
       *   E.g. "Nevermind" matches with "Nevermind (Remastered)"
       *        "Sign 'O' the Times" matches with "Sign "O" the Times"
       *        BUT "Use Your Illusion I" does not match with "Use Your Illusion II"
       */
      albumMatch(artistId, albumName, releaseYear) {
        function tokenize(title) {
          return [...title.toLowerCase().matchAll(/\w+/g)];
        }

        if (artistId && albumName && releaseYear) {
          const queryTokens = tokenize(albumName);

          return Album.all().find(album => {
            const matchTokens = tokenize(album.title);
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
        if (fullName && fullName.substring(0,4) === "The ") {
          return "The";
        } else {
          return "";
        }
      },
      name(fullName) {
        if (fullName && fullName.substring(0,4) === "The ") {
          return fullName.substring(4);
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
          const {data: artist} = await useApiFetchPost('/artist', artistData);
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
          const {data: album} = await useApiFetchPost('/album', albumData);
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
        const {data: song} = await useApiFetchPost('/song', songData);

        this.submitting = false;
        Object.assign(this.$data, this.initialData());
        this.$emit('newSong', song);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .heading {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
  }

  div.indent {
    margin-left: 20px;
    margin-bottom: 20px;
  }

  input[type="radio"]:not(:checked) + * {
    color: #aaaaaa;
  }

  .flex {
    display: flex;
    margin:  5px 0;

    > div.hint {
      flex-basis: 20%;
      font-weight: bold;
    }

    > div.input {
      flex-basis: 80%;
    }

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

  .otherArtistSongs {
    font-size: 60%;
    font-style: italic;
    margin-left: 5px;

    span {
      margin: 0 5px;
    }
  }
</style>
