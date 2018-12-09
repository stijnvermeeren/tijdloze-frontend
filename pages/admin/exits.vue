<template>
  <div>
    <h2>Exits markeren</h2>
    <div>
      <search-box
        :placeholder="`Zoek nummer uit de Tijdloze van ${completedYear.yyyy}`"
        :song-filter="songValid"
        :album-filter="album => false"
        :artist-filter="artist => false"
        @selectSearchResult="markExit($event.item)"
      />
    </div>
    <div v-if="exits.length">
      <h3>Exits</h3>
      <div>
        <ul>
          <li v-for="song in exits" :key="song.id">
            {{song.artist.fullName}} - {{song.title}} <button @click="unmarkExit(song)">Terugzetten</button>
          </li>
        </ul>
        <div><button @click="unmarkAll()">Alle exits terugzetten</button></div>
      </div>
    </div>
  </div>
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
        const possiblyInNextYear = nextYear ? song.possiblyInList(nextYear) : true;
        return inCompletedYear && possiblyInNextYear;
      },
      async unmarkAll() {
        await this.$axios.$delete('/list-exit');
        this.$store.dispatch('nuxtServerInit');
      },
      async unmarkExit(song) {
        await this.$axios.$delete(`/list-exit/${song.id}`);
        this.$store.dispatch('nuxtServerInit');
      },
      async markExit(song) {
        await this.$axios.$post(`/list-exit/${song.id}`);
        this.$store.dispatch('nuxtServerInit');
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
