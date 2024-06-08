<template lang="pug">
div
  div
    div.heading Artiest
    div.indent
      v-btn-toggle(v-model="artistType" color="blue" density="compact")
        v-btn(value="existing") Artiest uit de database
        v-btn(value="new") Nieuwe artiest
      div(v-if="artistType === 'existing'")
        admin-artist-select(v-model='artistId')
      div(v-else)
        v-container
          v-row(dense)
            v-col
              v-text-field(
                v-model='artistDetails.name'
                label="Naam"
                placeholder='The Beatles / Bob Dylan / ...'
                hide-details
              )
          v-row(dense)
            v-col
              admin-country-input(v-model='artistDetails.countryId')

  div(v-if='artistValid')
    div.heading Album
    div.indent
      v-radio-group(v-model="albumId" density="compact")
        v-radio(v-for="album in candidateAlbums" :key="album.id" :value="album.id" :label="`${album.title} (${album.releaseYear})`")
        v-radio(:value="0" label="Nieuw album")
        div.d-flex(v-if="albumId === 0")
          v-text-field.mr-4(
            v-model='albumDetails.title'
            label="Titel"
            :disabled="!!albumId"
            hide-details
          )
          v-text-field.releaseYear(
            v-model.number='albumDetails.releaseYear'
            label="Jaar"
            type="number"
            :disabled="!!albumId"
            hide-details
          )

  div.heading Nummer
  v-container
    v-row(dense)
      v-col
        v-text-field(v-model='songDetails.title' label="Titel" hide-details)
    v-row(dense)
      v-col
        admin-language-input(v-model='songDetails.languageId')
    v-row(dense)
      v-col
        admin-lead-vocals-input(v-model='songDetails.leadVocals')
    v-row(dense)
      v-col.otherArtistSongs(v-if="otherArtistSongs.length")
        | Opgelet! Reeds gekende nummers van deze artist:
        span(v-for="song in otherArtistSongs")
          | {{song.title}}
  div
    v-btn(
      color="blue"
      rounded
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

        const artist = useRepo(Artist).with('albums').find(this.artistId);
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
        if (this.albumId && this.album?.artistId !== this.artistId) {
          this.albumId = 0;
        }
      },
      initialData(preset) {
        const data = {
          artistType: 'new',
          artistId: undefined,
          artistDetails: {
            name: '',
            countryId: undefined
          },
          albumId: 0,
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

          data.artistDetails.name = preset.artistName;
          if (artist) {
            data.artistType = 'existing';
            data.artistId = artist.id;
          }

          data.albumDetails.title = preset.albumTitle;
          data.albumDetails.releaseYear = preset.albumYear;
          if (album) {
            data.albumId = album.id;
          } else {
            data.albumId = 0;
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

          return useRepo(Artist).all().find(artist => {
            const matchName = this.preProcessArtistName(artist.name);
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

          return useRepo(Album).all().find(album => {
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
      async submit() {
        this.submitting = true;

        let artistId = undefined;
        if (this.artistNew) {
          const artistData = {
            name: this.artistDetails.name,
            countryId: this.artistDetails.countryId
          }
          const {data: artist} = await useApiFetchPost('/artist', artistData);
          artistId = artist.value.id;
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
          albumId = album.value.id;
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
        this.$emit('newSong', song.value);
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

  .releaseYear{
    width: 100px;
    flex-grow: 0.2;
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
