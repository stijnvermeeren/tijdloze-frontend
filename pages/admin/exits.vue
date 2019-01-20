<template lang="pug">
  div
    h2 Exits markeren
    div
      search-box(
        :placeholder='`Zoek nummer uit de Tijdloze van ${completedYear.yyyy}`'
        :song-filter='songValid', :songs-year='completedYear'
        :album-filter='album => false'
        :artist-filter='artist => false'
        @selectSearchResult='markExit($event.item)'
      )

    div(v-if='exits.length')
      h3 Exits
      div
        ul
          li(v-for='song in exits', :key='song.id')
            | {{song.artist.fullName}} - {{song.title}}
            button(@click='unmarkExit(song)') Terugzetten
        div
          button(@click='unmarkAll()') Alle exits terugzetten
</template>

<script>
  import SearchBox from '../../components/SearchBox'
  export default {
    name: 'exits',
    components: {SearchBox},
    computed: {
      completedYear() {
        return this.$store.getters.completedYear;
      },
      exits() {
        return this.$store.getters.list(this.completedYear).filter(song => song.exitCurrent);
      }
    },
    methods: {
      songValid(song) {
        const inCompletedYear = song.position(this.completedYear);
        const nextYear = this.completedYear.next();
        const notYearInNextYear = nextYear ? !song.position(nextYear) : true;
        const notYetMarked = nextYear ? !song.exitCurrent : true;
        return inCompletedYear && notYearInNextYear && notYetMarked;
      },
      async unmarkAll() {
        await this.$axios.$delete('/list-exit');
        this.$store.dispatch('refreshCurrentList');
      },
      async unmarkExit(song) {
        await this.$axios.$delete(`/list-exit/${song.id}`);
        this.$store.dispatch('refreshCurrentList');
      },
      async markExit(song) {
        await this.$axios.$post(`/list-exit/${song.id}`);
        this.$store.dispatch('refreshCurrentList');
      }
    },
    middleware: 'admin',
    head: {
      title: 'Admin: Exits markeren'
    }
  }
</script>

<style scoped>

</style>
