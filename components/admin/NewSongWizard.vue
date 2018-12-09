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
        <tr>
          <th>Titel</th>
          <td><input v-model="albumDetails.title" /></td>
        </tr>
        <tr>
          <th>Jaar</th>
          <td><input v-model="albumDetails.releaseYear" /></td>
        </tr>
      </div>
    </div>

    <div v-if="artistValid && albumValid">
      <h4>Nummer</h4>
    </div>
  </div>
</template>

<script>
  import CountryInput from './CountryInput'
  import ArtistSelect from './ArtistSelect'
  import AlbumSelect from './AlbumSelect'
  export default {
    name: 'NewSongWizard',
    components: {AlbumSelect, ArtistSelect, CountryInput},
    props: {
      songTitle: {
        type: String
      },
      artistName: {
        type: String
      },
      albumTitle: {
        type: String
      },
      albumYear: {
        type: Number
      },
      spotifyId: {
        type: String
      }
    },
    data() {
      return {
        artistType: 'existing',
        artistId: undefined, // this.artist ? this.artist.id : undefined,
        artistDetails: {
          firstName: this.firstName(this.artistName),
          name: this.name(this.artistName),
          countryId: undefined
        },
        albumType: 'existing',
        albumId: undefined, // this.album ? this.album.id : undefined,
        albumDetails: {
          title: this.albumTitle,
          releaseYear: this.albumYear
        },
        songDetails: {
          title: this.songTitle,
          languageId: undefined,
          leadVocals: undefined
        }
      }
    },
    computed: {
      artistNew() {
        return this.artistType === 'new';
      },
      albumNew() {
        return this.albumType === 'new';
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
      }
    },
    watch: {
      artistId() {
        if (this.artistId && this.artistType === 'existing') {
          this.albumType = 'existing';
        } else {
          this.albumType = 'new';
        }
      },
      artistType() {
        if (this.artistId && this.artistType === 'existing') {
          this.albumType = 'existing';
        } else {
          this.albumType = 'new';
        }
      }
    },
    methods: {
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
      }
    }
  }
</script>

<style scoped>

</style>
