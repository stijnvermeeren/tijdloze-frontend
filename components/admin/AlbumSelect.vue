<template lang="pug">
  div
    div(v-if='album') {{album.title}} ({{album.releaseYear}})
    div(v-if='editing')
      select(v-model='albumId')
        option(v-for='album in candidateAlbums' :key='album.id' :value='album.id')
          | {{album.title}} ({{album.releaseYear}})
      button(@click='submit()') Bevestigen
    div(v-else)
      button(@click='editing = true') Wijzigen
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'AlbumSelect',
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
        editing: !this.value,
        albumId: this.value
      }
    },
    computed: {
      candidateAlbums() {
        const artist = this.$store.getters['entities/artists']().with('albums').find(this.artistId);
        if (artist) {
          return _.sortBy(
            artist.albums,
            [album => album.releaseYear, album => album.title]
          )
        } else {
          return [];
        }
      },
      album() {
        return this.$store.getters['entities/albums']().find(this.value);
      }
    },
    watch: {
      value(newValue) {
        if (!this.value) {
          this.editing = true;
        }
      },
    },
    methods: {
      submit() {
        this.$emit('input', this.albumId);
        this.editing = false;
      }
    }
  }
</script>
