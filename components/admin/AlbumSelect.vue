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
  import Artist from "@/orm/Artist";
  import Album from "@/orm/Album";
  import {useRepo} from "pinia-orm";

  export default {
    props: {
      modelValue: {
        type: Number
      },
      artistId: {
        type: Number
      }
    },
    emits: ['update:modelValue'],
    data() {
      return {
        editing: !this.modelValue,
        albumId: this.modelValue
      }
    },
    computed: {
      candidateAlbums() {
        const artist = useRepo(Artist).with('albums').find(this.artistId);
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
        return useRepo(Album).find(this.modelValue);
      }
    },
    watch: {
      modelValue(newValue) {
        if (!this.modelValue) {
          this.editing = true;
        }
      },
    },
    methods: {
      submit() {
        this.$emit('update:modelValue', this.albumId);
        this.editing = false;
      }
    }
  }
</script>
