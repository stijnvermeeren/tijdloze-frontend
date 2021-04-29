<template lang="pug">
  div
    div(v-if='artist') {{artist.fullName}}
    div(v-if='editing')
      search-box(
        :song-filter='song => false'
        :album-filter='album => false'
        placeholder='Zoek artiest...'
        @selectSearchResult='selectArtist($event.item)'
      )
      button(v-if='artist' @click='editing = false') Annuleren
    div(v-else)
      button(@click='editing = true') Wijzigen
      button(v-if="!required" @click='clear()') Verwijderen
</template>

<script>
  import SearchBox from '../SearchBox'
  export default {
    name: 'ArtistSelect',
    components: {SearchBox},
    props: {
      value: {
        type: Number
      },
      required: {
        type: Boolean,
        default: true
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
    watch: {
      value() {
        this.editing = !this.value;
      }
    },
    methods: {
      clear() {
        this.value = undefined;
        this.$emit('input', undefined);
      },
      selectArtist(artist) {
        this.$emit('input', artist.id);
        this.editing = false;
      }
    }
  }
</script>

<style scoped>

</style>
