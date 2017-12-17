<template>
    <div>
        <ul v-if="albums.length">
            <li v-for="album in albums">
                <tijdloze-album :album="album" /> ({{album.releaseYear}})
                <ul v-if="songsByAlbumId(album.id)">
                    <li v-for="song in songsByAlbumId(album.id)"><tijdloze-song :song="song" /></li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    props: ['artist'],
    computed: {
      albums() {
        return this.$store.getters.albumsByArtistId(this.artist.id);
      }
    },
    methods: {
      songsByAlbumId(albumId) {
        return this.$store.getters.songsByAlbumId(albumId);
      }
    }
  }
</script>
