<template>
  <div>
    <h3>Nieuw nummer toevoegen</h3>

    <h4>Artiest</h4>
    <div>
      <div>
        <span>
          <input type="radio" v-model="artistType" value="existing" id="artist-existing">
          <label for="artist-existing">Bestaande artiest</label>
        </span>
        <span>
          <input type="radio" v-model="artistType" value="new" id="artist-new">
          <label for="artist-new">Nieuwe artiest</label>
        </span>
      </div>
      <div v-if="!artistNew">
        <artist-select v-model="artistId" />
      </div>
      <div v-if="artistNew">
        <table class="info">
          <tbody>
            <tr>
              <th>Voornaam</th>
              <td><input v-model="artistDetails.firstName" placeholder="The / Bob / ..." /></td>
            </tr>
            <tr>
              <th>Naam</th>
              <td><input v-model="artistDetails.name" placeholder="Beatles / Dylan / ..." /></td>
            </tr>
            <tr>
              <th>Land</th>
              <td><country-input v-model="artistDetails.countryId" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="artistValid">
      <h4>Album</h4>
      <div>
        <span>
          <input type="radio" v-model="albumType" value="existing" id="album-existing" :disabled="!artistId || artistType === 'new'">
          <label for="album-existing">Bestaand album</label>
        </span>
        <span>
          <input type="radio" v-model="albumType" value="new" id="album-new">
          <label for="album-new">Nieuw album</label>
        </span>
      </div>
      <div v-if="!albumNew">
        <album-select v-model="albumId" :artist-id="artistId" />
      </div>
      <div v-if="albumNew">
        <table class="info">
          <tbody>
            <tr>
              <th>Titel</th>
              <td><input v-model="albumDetails.title" /></td>
            </tr>
            <tr>
              <th>Jaar</th>
              <td><input v-model.number="albumDetails.releaseYear" type="number" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="artistValid && albumValid">
      <h4>Nummer</h4>
      <div>
        <table class="info">
          <tbody>
            <tr>
              <th>Titel</th>
              <td><input v-model="songDetails.title" /></td>
            </tr>
            <tr>
              <th>Taal</th>
              <td><language-input v-model="songDetails.languageId" /></td>
            </tr>
            <tr>
              <th>Lead vocals</th>
              <td><lead-vocals-input v-model="songDetails.leadVocals" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div><button :disabled="!songValid || submitting" @click="submit()">Toevoegen</button></div>
    </div>
  </div>
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
      }
    },
    data() {
      return this.initialData();
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
          return this.artistDetails.name && this.artistDetails.countryId;
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
        return this.songDetails.title && this.songDetails.languageId && this.songDetails.leadVocals;
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
        Object.assign(this.$data, this.initialData());
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
      initialData() {
        const artist = this.artistMatch(this.preset.artistName)
        const album = artist
          ? this.albumMatch(artist.id, this.preset.albumTitle, this.preset.albumYear)
          : undefined;

        return {
          artistType: (artist || !this.preset.artistName) ? 'existing' : 'new',
          artistId: artist ? artist.id : undefined,
          artistDetails: {
            firstName: this.firstName(this.preset.artistName),
            name: this.name(this.preset.artistName),
            countryId: undefined
          },
          albumType: (album || !this.preset.albumTitle) ? 'existing' : 'new',
          albumId: album ? album.id : undefined,
          albumDetails: {
            title: this.preset.albumTitle,
            releaseYear: this.preset.albumYear
          },
          songDetails: {
            title: this.preset.songTitle,
            languageId: undefined,
            leadVocals: undefined
          },
          submitting: false
        }
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
          const query = albumName.toLowerCase();

          return this.$store.getters['entities/albums/query']().all().find(album => {
            const matchName = album.title.toLowerCase();
            const minLength = Math.min(query.length, matchName.length);
            return album.artistId === artistId &&
              query.substr(0, minLength) === matchName.substr(0, minLength) &&
              album.releaseYear === releaseYear;
          })
        } else {
          return undefined;
        }
      },
      firstName(fullName) {
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
            firstName: this.artistDetails.firstName,
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
          leadVocals: this.songDetails.leadVocals
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

</style>
