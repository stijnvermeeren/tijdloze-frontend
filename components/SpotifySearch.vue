<template>
  <div>
    <div>
      <input v-model="query" @keypress.enter="search()" />
      <button @click="search()" :disabled="processing">
        Zoeken op Spotify
      </button>
    </div>
    <div v-if="spotifyTracks.length">
      <ul>
        <li v-for="track in spotifyTracks" :key="track.spotifyId">
          <div>Titel: <strong>{{ track.title }}</strong></div>
          <div>Artiest: <strong>{{ track.artist }}</strong></div>
          <div>Album: {{ track.album }} ({{ track.year }})</div>
          <div><spotify :spotifyId="track.spotifyId" /></div>
          <div><button @click="select(track)">Selecteren</button></div>
        </li>
      </ul>
      <div><button @click="cancel()">Zoeken annuleren</button></div>
    </div>
  </div>
</template>

<script>
  import Spotify from './Spotify'
  export default {
    name: 'SpotifySearch',
    components: {Spotify},
    data() {
      return {
        query: '',
        processing: false,
        spotifyTracks: []
      }
    },
    methods: {
      cancel() {
        this.query = '';
        this.spotifyTracks = [];
      },
      search() {
        this.spotifyTracks = [];
        this.processing = true;
        this.$axios.$get('/spotify/find', {params: {query: this.query, limit: 3}}).then(result => {
          this.spotifyTracks = result
          this.processing = false;
        })
      },
      select(track) {
        this.$emit('selectSpotifyTrack', track);
        this.cancel();
      }
    }
  }
</script>
