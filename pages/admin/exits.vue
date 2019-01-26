<template lang="pug">
  div
    h2 Exits markeren ({{currentYear.yyyy}})
    div
      search-box(
        :placeholder='`Zoek nummer uit de Tijdloze van ${previousYear.yyyy}`'
        :song-filter='songValid', :songs-year='previousYear'
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
  import Song from '~/store/Song'
  import SearchBox from '../../components/SearchBox'

  export default {
    name: 'exits',
    components: {SearchBox},
    computed: {
      exitSongIds() {
        return this.$store.state.exitSongIds;
      },
      exits() {
        return this.exitSongIds.map(id => {
          return Song.query().with('artist').find(id)
        });
      },
      previousYear() {
        return this.currentYear.previous();
      },
      currentYear() {
        return this.$store.getters.currentYear;
      }
    },
    methods: {
      songValid(song) {
        const inPreviousYear = song.position(this.previousYear);

        const notYetInCurrentYear = this.currentYear ? !song.position(this.currentYear) : true;
        const notYetMarked = !this.exitSongIds.includes(song.id);
        return inPreviousYear && notYetInCurrentYear && notYetMarked;
      },
      async unmarkAll() {
        await this.$axios.$delete(`/list-exit/${this.currentYear.yyyy}`);
        this.$store.dispatch('refreshCurrentList');
      },
      async unmarkExit(song) {
        await this.$axios.$delete(`/list-exit/${this.currentYear.yyyy}/${song.id}`);
        this.$store.dispatch('refreshCurrentList');
      },
      async markExit(song) {
        await this.$axios.$post(`/list-exit/${this.currentYear.yyyy}/${song.id}`);
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
