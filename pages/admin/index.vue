<template lang="pug">
  div
    h2 Admin
    h3 De Tijdloze Live
    ul
      li
        nuxt-link(to='/admin/live') Nummers toevoeren
      li
        nuxt-link(to='/admin/exits') Exits markeren
      li
        nuxt-link(to='/admin/polls') Polls
      li
        nuxt-link(to='/admin/analysis') Interessante feiten
    h3 Database
    ul
      li
        | Aanpassen:
        search-box(@selectSearchResult='selectSearchResult($event)')
    h3 Gebruikers
    ul
      li
        nuxt-link(to='admin/users') User admin
    h3 Opties
    ul
      li
        nuxt-link(to='/admin/chat') Chat / reacties mode
      li
        nuxt-link(to='/admin/intro') Homepage intro
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
