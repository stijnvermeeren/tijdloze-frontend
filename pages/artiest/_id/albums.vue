<template>
    <div>
        <h2><tijdloze-h2-icon name="artist" alt="Artiest" />{{artist.fullName}}</h2>

        <tijdloze-tabs :tabs="[{ to: `/artiest/${artist.id}`, title: 'Informatie en nummers' }, { title: 'Albums' }]">
            <ul v-if="albums.length">
                <li v-for="album in albums">
                    <tijdloze-album :album="album" /> ({{album.releaseYear}})
                    <ul v-if="songsByAlbumId(album.id)">
                        <li v-for="song in songsByAlbumId(album.id)"><tijdloze-song :song="song" /></li>
                    </ul>
                </li>
            </ul>
        </tijdloze-tabs>
    </div>
</template>

<script>
  import H2Icon from "../../../components/H2Icon";

  export default {
    components: {
      TijdlozeH2Icon: H2Icon
    },
    computed: {
      artist() {
        return this.$store.getters.artistsById[this.artistId];
      },
      albums() {
        return this.$store.getters.albumsByArtistId(this.artistId);
      }
    },
    methods: {
      songsByAlbumId(albumId) {
        return this.$store.getters.songsByAlbumId(albumId);
      }
    },
    asyncData({ params }) {
      return {
        artistId: Number(params.id)
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
