<template>
  <div>
    <h2>Admin: live updates</h2>

    <h3>Vorig nummer</h3>
    <div>
      <strong>Positie {{lastPosition}} in {{currentYear.yyyy}}:</strong>
    </div>
    <div>
      {{ lastSong.artist.fullName }} - {{ lastSong.title }}
      <button @click="undo()" :disabled="processing">Ongedaan maken</button>
    </div>

    <h3>Volgend nummer</h3>
    <div><strong>Positie {{nextPosition}} in {{nextYearYyyy}}</strong></div>

    <div>
      <input type="radio" value="existing" v-model="nextSongType" id="nextType-existing" />
      <label for="nextType-existing">Nummer dat reeds in de Tijdloze stond</label>
      <input type="radio" value="new" v-model="nextSongType" id="nextType-new" />
      <label for="nextType-new">Nieuw nummer</label>
    </div>

    <div class="box" v-show="nextSongType === 'existing'">
      <search-box
        placeholder="Zoek nummer..."
        :artist-filter="artist => false"
        :album-filter="album => false"
        :song-filter="possibleSong"
        :songs-year="completedYear"
        @selectSearchResult="selectSearchResult($event)"
      />
      <div v-if="nextSong">
        <strong>{{nextSong.artist.fullName}} - {{nextSong.title}}</strong>
        (in {{completedYear.yyyy}} op positie <position :year="completedYear" :song="nextSong" />)
      </div>
      <div v-if="nextSongFullData && nextSongFullData.spotifyId">
        <spotify :spotifyId="nextSongFullData.spotifyId" />
      </div>

      <div>
        <button @click="add(nextSong.id)" :disabled="!nextValid">
          Toevoegen op positie {{nextPosition}} in {{nextYearYyyy}}
        </button>
      </div>
    </div>

    <div class="box" v-show="nextSongType === 'new'">
      <spotify-search @selectSpotifyTrack="selectSpotifyTrack($event)" />

      <hr />

      <new-song-wizard
        :preset="spotifyData"
        :button-label="`Toevoegen op positie ${nextPosition} in ${nextYearYyyy}`"
        @newSong="add($event.id)"
      />
    </div>
  </div>
</template>

<script>
  import SearchBox from '../../components/SearchBox'
  import Position from '../../components/Position'
  import Spotify from '../../components/Spotify'
  import SpotifySearch from '../../components/admin/SpotifySearch'
  import NewSongWizard from '../../components/admin/NewSongWizard'

  export default {
    components: {NewSongWizard, SpotifySearch, Spotify, Position, SearchBox},
    data() {
      return {
        nextSongType: 'existing',
        nextSong: undefined,
        nextSongFullData: undefined,
        processing: false,
        spotifyData: undefined
      }
    },
    computed: {
      currentYear() {
        return this.$store.getters.currentYear;
      },
      completedYear() {
        return this.$store.getters.completedYear;
      },
      lastSong() {
        return this.$store.getters.lastSong;
      },
      lastPosition() {
        return this.$store.getters.lastPosition
      },
      nextYearYyyy() {
        return this.lastPosition === 1 ? this.currentYear.yyyy + 1 : this.currentYear.yyyy;
      },
      nextPosition() {
        return this.lastPosition === 1 ? 100 : this.lastPosition - 1;
      },
      nextValid() {
        if (this.nextSongType === 'existing') {
          return !!this.nextSong
        } else {
          return true
        }
      }
    },
    methods: {
      async selectSearchResult(result) {
        this.nextSong = result.item;
        this.nextSongFullData = undefined;

        this.nextSongFullData = await this.$axios.$get(`song/${this.nextSong.id}`);
      },
      selectSpotifyTrack(track) {
        this.spotifyData = {
          songTitle: track.title,
          artistName: track.artist,
          albumTitle: track.album,
          albumYear: track.year,
          spotifyId: track.spotifyId
        };
      },
      async undo() {
        this.processing = true;
        await this.$axios.$delete(`list-entry/${this.currentYear.yyyy}/${this.lastPosition}`)
        this.$store.dispatch('refreshCurrentList');
        this.processing = false;
      },
      async add(songId) {
        this.processing = true;
        const data = {
          songId
        }
        await this.$axios.$post(`list-entry/${this.nextYearYyyy}/${this.nextPosition}`, data)
        this.$store.dispatch('refreshCurrentList');
        this.nextSongType = 'existing';
        this.nextSong = undefined;
        this.nextSongFullData = undefined;
        this.spotifyData = undefined;
        this.processing = false;
      },
      possibleSong(song) {
        if (this.nextYearYyyy === this.currentYear.yyyy) {
          return !song.position(this.currentYear) && !song.exitCurrent;
        } else {
          return true;
        }
      }
    },
    middleware: 'admin',
    head: {
      title: 'Admin: Live'
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
