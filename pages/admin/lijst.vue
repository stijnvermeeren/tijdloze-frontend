<template lang="pug">
Title Admin: huidige lijst
div
  h2 Admin: volledige lijst van dit jaar

  div(v-for="song in songs")
    | {{song.position(currentYear, true)}}. {{song.artist.fullName}} - {{song.title}} (
    a(@click="remove(song)")
      | Uit lijst verwijderen
    | )
</template>

<script setup>
definePageMeta({ middleware: 'admin' })
</script>

<script>
  import SearchBox from '../../components/SearchBox'
  import Position from '../../components/Position'
  import Spotify from '../../components/Spotify'
  import SpotifySearch from '../../components/admin/SpotifySearch'
  import NewSongWizard from '../../components/admin/NewSongWizard'
  import {useRootStore} from "~/stores/root";

  export default defineNuxtComponent({
    components: {NewSongWizard, SpotifySearch, Spotify, Position, SearchBox},
    data() {
      return {
      }
    },
    computed: {
      currentYear() {
        return useRootStore().currentYear;
      },
      songs() {
        return useRootStore().list(this.currentYear)
      }
    },
    methods: {
      async remove(song) {
        const position = song.position(this.currentYear, true)
        if (confirm(`"${song.artist.fullName} - ${song.title}" (positie ${position}) verwijderen uit de lijst van ${this.currentYear.yyyy})?`)) {
          await useApiFetchDelete(`list-entry/${this.currentYear.yyyy}/${position}`)
        }
      }
    }
  })
</script>
