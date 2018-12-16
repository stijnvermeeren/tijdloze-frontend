<template>
  <div>
    <div>
      <input v-model="query" @keypress.enter="search()" placeholder="Titel en/of artiest" />
      <button @click="search()" :disabled="processing">
        Zoeken op Spotify
      </button>
    </div>
    <div v-if="spotifyTracks.length">
      <table>
        <tbody>
          <tr v-for="track in spotifyTracks" :key="track.spotifyId">
            <td><spotify :spotifyId="track.spotifyId" /></td>
            <td><button @click="select(track)">Selecteren</button></td>
          </tr>
        </tbody>
      </table>
      <div><button @click="cancel()">Zoeken annuleren</button></div>
    </div>
  </div>
</template>

<script>
  import Spotify from '../Spotify'

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

<style lang="less" scoped>
  input {
    width: 300px;
  }

  table {
    width: auto;
    margin: 10px auto 10px 0
  }
</style>
