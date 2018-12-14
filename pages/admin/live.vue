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
    <h4>Nummer dat reeds in de Tijdloze stond</h4>
    <div>
      <search-box
        placeholder="Zoek nummer..."
        :artist-filter="artist => false"
        :album-filter="album => false"
        :song-filter="possibleSong"
        :songs-year="completedYear"
        @selectSearchResult="selectSearchResult($event)"
      />
      <div v-if="nextSong">
        {{nextSong.artist.fullName}} - {{nextSong.title}} ({{completedYear.yyyy}}: <position :year="completedYear" :song="nextSong" />)
      </div>
      <div v-if="nextSongFullData && nextSongFullData.spotifyId">
        <spotify :spotifyId="nextSongFullData.spotifyId" />
      </div>
      <div>
        <button @click="add(nextSong.id)">Toevoegen op positie {{nextPosition}} in {{nextYearYyyy}}</button>
      </div>
    </div>

    <h3>Nummer zoeken op Spotify</h3>
    <spotify-search @selectSpotifyTrack="selectSpotifyTrack($event)" />

    <new-song-wizard :preset="spotifyData" @newSong="add($event.id)" />
  </div>
</template>

<script>
  import _ from 'lodash'
  import SearchBox from '../../components/SearchBox'
  import Position from '../../components/Position'
  import Spotify from '../../components/Spotify'
  import SpotifySearch from '../../components/SpotifySearch'
  import NewSongWizard from '../../components/admin/NewSongWizard'

  export default {
    components: {NewSongWizard, SpotifySearch, Spotify, Position, SearchBox},
    data() {
      return {
        nextSong: undefined,
        nextSongFullData: undefined,
        processing: false,
        spotifyData: {}
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
    },
    methods: {
      selectSearchResult(result) {
        this.nextSong = result.item;
        this.nextSongFullData = undefined;

        this.$axios.$get(`song/${this.nextSong.id}`).then(fullSongData => {
          this.nextSongFullData = fullSongData;
        })
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
      undo() {
        this.processing = true;
        this.$axios.$delete(`list-entry/${this.currentYear.yyyy}/${this.lastPosition}`).then(response => {
          this.$store.dispatch('nuxtServerInit');
          this.processing = false;
        })
      },
      add(songId) {
        this.processing = true;
        const data = {
          songId
        }
        this.$axios.$post(`list-entry/${this.nextYearYyyy}/${this.nextPosition}`, data).then(response => {
          this.$store.dispatch('nuxtServerInit');
          this.nextSong = undefined;
          this.nextSongFullData = undefined;
          this.processing = false;
        })
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

</style>
