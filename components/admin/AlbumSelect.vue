<template>
  <div>
    <div v-if="album">{{album.title}} ({{album.releaseYear}})</div>
    <div v-if="editing">
      <search-box
        :song-filter="song => false"
        :album-filter="album => album.artistId === artistId"
        :artist-filter="artist => false"
        @selectSearchResult="selectAlbum($event.item)"
      />
      <button @click="editing = false">Annuleren</button>
    </div>
    <div v-else>
      <button @click="editing = true">Wijzigen</button>
    </div>
  </div>
</template>

<script>
  import SearchBox from '../SearchBox'

  export default {
    name: 'AlbumSelect',
    components: {SearchBox},
    props: {
      value: {
        type: Number
      },
      artistId: {
        type: Number
      }
    },
    data() {
      return {
        editing: !this.value
      }
    },
    computed: {
      album() {
        if (this.value) {
          return this.$store.getters['entities/albums']().find(this.value);
        } else {
          return undefined;
        }
      }
    },
    methods: {
      selectAlbum(album) {
        this.$emit('input', album.id);
        this.editing = false;
      }
    }
  }
</script>

<style scoped>

</style>
