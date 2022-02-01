<template lang="pug">
  div
    h2 Admin: volledige lijst van dit jaar

    div(v-for="song in songs")
      | {{song.position(currentYear, true)}}. {{song.artist.fullName}} - {{song.title}} (
      a(@click="remove(song)")
        | Uit lijst verwijderen
      | )
</template>

<script>
  import SearchBox from '../../components/SearchBox'
  import Position from '../../components/Position'
  import Spotify from '../../components/Spotify'
  import SpotifySearch from '../../components/admin/SpotifySearch'
  import NewSongWizard from '../../components/admin/NewSongWizard'

  export default {
    components: {NewSongWizard, SpotifySearch, Spotify, Position, SearchBox},
    data() {
      return {
      }
    },
    computed: {
      currentYear() {
        return this.$store.getters.currentYear;
      },
      songs() {
        return this.$store.getters.list(this.currentYear, true)
      }
    },
    methods: {
      async remove(song) {
        const position = song.position(this.currentYear, true)
        if (confirm(`"${song.artist.fullName} - ${song.title}" (positie ${position}) verwijderen uit de lijst van ${this.currentYear.yyyy})?`)) {
          await this.$axios.$delete(`list-entry/${this.currentYear.yyyy}/${position}`)
        }
      }
    },
    middleware: 'admin',
    head: {
      title: 'Admin: huidige lijst'
    }
  }
</script>
