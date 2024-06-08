<template lang="pug">
div.d-flex.py-2
  div(v-if='artist') {{artist.name}}
  template(v-if='editing')
    search-box.flex-grow-1(
      :song-filter='song => false'
      :album-filter='album => false'
      placeholder='Zoek artiest...'
      @selectSearchResult='selectArtist($event.item)'
      :disabled="disabled"
    )
    v-btn(v-if='artist' @click='editing = false' :disabled="disabled") Annuleren
  template(v-else)
    v-btn(@click='editing = true' :disabled="disabled") Wijzigen
    v-btn(v-if="!required" @click='clear()' :disabled="disabled") Verwijderen
</template>

<script>
  import SearchBox from '../SearchBox'
  import Artist from "@/orm/Artist";
  import {useRepo} from "pinia-orm";
  export default {
    components: {SearchBox},
    props: {
      modelValue: {
        type: Number
      },
      required: {
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modelValue'],
    data() {
      return {
        editing: !this.modelValue
      }
    },
    computed: {
      artist() {
        if (this.modelValue) {
          return useRepo(Artist).find(this.modelValue);
        } else {
          return undefined;
        }
      }
    },
    watch: {
      modelValue() {
        this.editing = !this.modelValue;
      }
    },
    methods: {
      clear() {
        this.modelValue = undefined;
        this.$emit('update:modelValue', undefined);
      },
      selectArtist(artist) {
        this.$emit('update:modelValue', artist.id);
        this.editing = false;
      }
    }
  }
</script>

<style lang="scss" scoped>
.d-flex {
  align-items: center;

  > * {
    margin-right: 10px;
  }
}
</style>
