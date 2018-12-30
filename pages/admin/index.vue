<template>
  <div>
    <h2>Admin</h2>

    <h3>De Tijdloze Live</h3>
    <ul>
      <li><nuxt-link to="/admin/live">Nummers toevoeren</nuxt-link></li>
      <li><nuxt-link to="/admin/exits">Exits markeren</nuxt-link></li>
      <li><nuxt-link to="/admin/polls">Polls</nuxt-link></li>
      <li><nuxt-link to="/admin/analysis">Interessante feiten</nuxt-link></li>
      <li><nuxt-link to="/admin/chat">Chat activeren</nuxt-link></li>
    </ul>

    <h3>Database</h3>
    <ul>
      <li>
        Aanpassen:
        <search-box
          @selectSearchResult="selectSearchResult($event)"
        />
      </li>
    </ul>

    <h3>Gebruikers</h3>
    <ul>
      <li><nuxt-link to="admin/users">User admin</nuxt-link></li>
    </ul>
  </div>
</template>

<script>
  import SearchBox from '../../components/SearchBox'
  export default {
    components: {SearchBox},
    methods: {
      selectSearchResult(result) {
        let path = ''

        if (result.type === 'song') {
          path = `/admin/song/${result.item.id}`
        } else if (result.type === 'artist') {
          path = `/admin/artist/${result.item.id}`
        } else if (result.type === 'album') {
          path = `/admin/album/${result.item.id}`
        }
        if (path) {
          this.$router.push(path);
        }

      }
    },
    middleware: 'admin'
  }
</script>

<style scoped>

</style>
