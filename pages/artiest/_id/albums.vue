<template>
    <div>
        <h2><img src="/images/icon/artist.png" alt="Artiest" class="icon" />{{artist.fullName}}</h2>

        <tijdloze-tabs :tabs="[{ to: `/artiest/${artist.id}`, title: 'Informatie en nummers' }, { title: 'Albums' }]">
            <ul v-if="albums.length">
                <li v-for="album in albums">
                    <tijdloze-album :album="album" /> ({{album.year}})
                    <ul v-if="songsByAlbumId(album.id)">
                        <li v-for="song in songsByAlbumId(album.id)"><tijdloze-song :song="song" /></li>
                    </ul>
                </li>
            </ul>
        </tijdloze-tabs>
    </div>
</template>

<script>
  export default {
    computed: {
      artist() {
        return this.$store.getters.artistsById[this.fullArtistData.id];
      },
      albums() {
        return this.$store.getters.albumsByArtistId(this.artist.id);
      }
    },
    methods: {
      songsByAlbumId(albumId) {
        return this.$store.getters.songsByAlbumId(albumId);
      }
    },
    async asyncData({ params, app }) {
      return {
        fullArtistData: await app.$axios.$get(`artist/${params.id}`)
      };
    },
    head() {
      return {
        title: this.artist.fullName
      }
    }
  }
</script>

<style scoped>

</style>
