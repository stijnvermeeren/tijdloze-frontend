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
        placeholder="Zoek artiest, album of nummer..."
        :songs-only="true"
        @selectSearchResult="selectSearchResult($event)"
      />
      <div v-if="nextSong">
        {{nextSong.artist.fullName}} - {{nextSong.title}} ({{yearBeforeNext.yyyy}}: <position :year="yearBeforeNext" :song="nextSong" />)
      </div>
      <div v-if="nextSongFullData">
        <spotify :spotifyId="nextSongFullData.spotifyId" />
      </div>
      <div>
        <button @click="add()">Toevoegen op positie {{nextPosition}} in {{nextYearYyyy}}</button>
      </div>
    </div>

    <h4>Nummer zoeken op Spotify</h4>
    <spotify-search @selectSpotifyTrack="selectSpotifyTrack($event)" />
  </div>
</template>

<script>
  import _ from 'lodash'
  import SearchBox from '../../components/SearchBox'
  import Position from '../../components/Position'
  import Spotify from '../../components/Spotify'
  import SpotifySearch from '../../components/SpotifySearch'

  export default {
    components: {SpotifySearch, Spotify, Position, SearchBox},
    data() {
      return {
        nextSong: undefined,
        nextSongFullData: undefined,
        processing: false
      }
    },
    computed: {
      currentYear() {
        return this.$store.getters.currentYear;
      },
      lastSong() {
        return _.first(this.$store.getters.list(this.currentYear));
      },
      lastPosition() {
        return this.lastSong.position(this.currentYear)
      },
      yearBeforeNext() {
        return this.lastPosition === 1 ? this.currentYear : this.currentYear.previous();
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
        console.log(track);
      },
      undo() {
        this.processing = true;
        this.$axios.$delete(`list-entry/${this.currentYear.yyyy}/${this.lastPosition}`).then(response => {
          this.$store.dispatch('nuxtServerInit');
          this.processing = false;
        })
      },
      add() {
        this.processing = true;
        const data = {
          'songId': this.nextSong.id
        }
        this.$axios.$post(`list-entry/${this.nextYearYyyy}/${this.nextPosition}`, data).then(response => {
          this.$store.dispatch('nuxtServerInit');
          this.nextSong = undefined;
          this.nextSongFullData = undefined;
          this.processing = false;
        })
      }
    },
    middleware: 'admin'
  }
</script>

<style scoped>

</style>
