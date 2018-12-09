<template>
  <div>
    <div v-if="artist">{{artist.fullName}}</div>
    <div v-if="editing">
      <search-box
        :song-filter="song => false"
        :album-filter="album => false"
        placeholder="Zoek artiest..."
        @selectSearchResult="selectArtist($event.item)"
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
    name: 'ArtistSelect',
    components: {SearchBox},
    props: {
      value: {
        type: Number
      }
    },
    data() {
      return {
        editing: !this.value
      }
    },
    computed: {
      artist() {
        if (this.value) {
          return this.$store.getters['entities/artists']().find(this.value);
        } else {
          return undefined;
        }
      }
    },
    methods: {
      selectArtist(artist) {
        this.$emit('input', artist.id);
        this.editing = false;
      }
    }
  }
</script>

<style scoped>

</style>
