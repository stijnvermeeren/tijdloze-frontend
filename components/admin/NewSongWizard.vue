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
          v-row(dense)
            v-col
              admin-musicbrainz-input(
                v-model='artistDetails.musicbrainzId'
                musicbrainz-category="artist"
              )

  div(v-if='artistValid')
    div.heading Album
    div.indent
      v-radio-group(v-model="albumId" density="compact")
        v-radio(v-for="album in candidateAlbums" :key="album.id" :value="album.id" :label="`${album.title} (${album.releaseYear})`")
        v-radio(:value="0" label="Nieuw album")
        div(v-if="albumId === 0")
          div.d-flex
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
          div
            admin-musicbrainz-input(
              v-model='albumDetails.musicbrainzId'
              musicbrainz-category="release-group"
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
      v-col
        admin-song-spotify-input(
          v-model="songDetails.spotifyId"
          :artist="artistName"
          :album="albumTitle"
          :title="songDetails.title"
          ref="spotify"
        )
    v-row(dense)
      v-col(v-if="existingSong")
        ui-alert(type="warning" title="Opgelet! Dit nummer is reeds in de database!")
          v-btn(@click="selectExisting()")
            | Selecteer&nbsp;
            strong {{existingSong.title}}
            | &nbsp;uit de database
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
  import {useRepo} from "pinia-orm";
  import useFetchData from "~/composables/useFetchData";

  function initialData() {
    return {
      artistType: 'new',
      artistId: undefined,
      artistDetails: {
        name: '',
        musicbrainzId: undefined,
        countryId: undefined
      },
      albumId: 0,
      albumDetails: {
        title: '',
        musicbrainzId: undefined,
        releaseYear: undefined
      },
      songDetails: {
        title: '',
        languageId: undefined,
        leadVocals: undefined,
        spotifyId: undefined
      },
      existingSong: undefined,
      submitting: false
    }
  }

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
      return initialData()
    },
    computed: {
      artistName() {
        if (this.artistId) {
          return this.artist.name;
        } else {
          return this.artistDetails.name;
        }
      },
      albumTitle() {
        if (this.albumId) {
          return this.album.title;
        } else {
          return this.albumDetails.title
        }
      },
      artistNew() {
        return this.artistType === 'new';
      },
      album() {
        return useRepo(Album).find(this.albumId);
      },
      artist() {
        return useRepo(Artist).find(this.artistId);
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
      'songDetails.spotifyId': async function() {
        this.existingSong = await this.loadExistingSong()
      }
    },
    methods: {
      selectExisting() {
        this.$emit('existingSong', this.existingSong);
      },
      async loadExistingSong() {
        if (!this.artistNew && this.artistId && this.songDetails.spotifyId) {
          const artist = useRepo(Artist)
              .withAll()
              .with('songs', q => q
                  .with('artist')
                  .with('secondArtist'))
              .find(this.artistId)
          if (artist) {
            for (const song of artist.songs) {
              const fullSongData = await this.$api(`song/${song.id}`)
              if (fullSongData) {
                if (fullSongData.spotifyId === this.songDetails.spotifyId) {
                  return song
                }
              }
            }
          }
        }
      },
      checkAlbum() {
        if (this.albumId && this.album?.artistId !== this.artistId) {
          this.albumId = 0;
        }
      },
      async loadPreset(preset) {
        const artist = await this.artistMatch(preset.artistName, preset.artistMBId);
        const album = artist
          ? await this.albumMatch(artist.id, preset.albumTitle, preset.albumYear, preset.albumMBId)
          : undefined;

        this.artistDetails.name = preset.artistName;
        this.artistDetails.musicbrainzId = preset.artistMBId;
        this.artistDetails.countryId = preset.artistCountryId;
        if (artist) {
          this.artistType = 'existing';
          this.artistId = artist.id;
        } else {
          this.artistType = 'new';
          this.artistId = 0;
        }

        this.albumDetails.title = preset.albumTitle;
        this.albumDetails.musicbrainzId = preset.albumMBId;
        this.albumDetails.releaseYear = preset.albumYear;
        if (album) {
          this.albumId = album.id;
        } else {
          this.albumId = 0;
        }

        this.songDetails.title = preset.songTitle;

        nextTick(() =>
            this.$refs.spotify.search()
        )
      },
      preProcessArtistName(artistName) {
        let query = useSearchNormalize(artistName.toLowerCase());
        if (query.substring(0,4) === 'the') {
          query = artistName.substring(4);
        }
        return query;
      },
      async artistMatch(artistName, artistMBId) {
        const artist = await this.$api(`/artist/musicbrainz/${artistMBId}`).catch(
            () => undefined
        );
        if (artist)  {
          return useRepo(Artist).find(artist.id)
        }

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
       * An album matches if the MusicBrainz id matches, or
       * - The artist matches
       * - The release year matches
       * - The titles match (case-insensitive) where one title is allowed to have some extra words. Punctuation is
       *   ignored.
       *   E.g. "Nevermind" matches with "Nevermind (Remastered)"
       *        "Sign 'O' the Times" matches with "Sign "O" the Times"
       *        BUT "Use Your Illusion I" does not match with "Use Your Illusion II"
       */
      async albumMatch(artistId, albumName, releaseYear, albumMBId) {
        const album = await this.$api(`/album/musicbrainz/${albumMBId}`);
        if (album)  {
          return useRepo(Album).find(album.id)
        }

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
          const artist = await this.$api('/artist', useFetchOptsPost(artistData));
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
          const album = await this.$api('/album', useFetchOptsPost(albumData));
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
        const song = await this.$api('/song', useFetchOptsPost(songData));

        this.submitting = false;
        Object.assign(this.$data, initialData());
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

  .releaseYear{
    width: 100px;
    flex-grow: 0.2;
  }
</style>
