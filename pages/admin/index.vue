<template>
  <div>
    <h2>Admin</h2>
    <ul>
      <li><nuxt-link to="/admin/live">Live updates</nuxt-link></li>
      <li><nuxt-link to="/admin/exits">Exits markeren</nuxt-link></li>
      <li>
        Aanpassen:
        <search-box
          @selectSearchResult="selectSearchResult($event)"
        />
      </li>
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
