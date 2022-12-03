<template lang="pug">
  div
    h2 Admin
    h3 De Tijdloze Live
    ul
      li
        nuxt-link(to='/admin/live') Nummers toevoegen
      li
        nuxt-link(to='/admin/lijst') Volledige lijst van dit jaar
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
        el-switch(v-model="commentsOn" :active-value="'on'" :inactive-value="'off'")
        |
        | Reacties open
      li
        el-switch(v-model="chatOn" :active-value="'on'" :inactive-value="'off'")
        |
        | Chatbox open
      li
        button(@click="invalidateCache") Invalidate API caches
</template>

<script>
  import SearchBox from '../../components/SearchBox'
  export default {
    components: {SearchBox},
    watch: {
      async chatOn() {
        const data = {
          text: this.chatOn
        };
        await this.$axios.$post(`text/chatOn`, data);
      },
      async commentsOn() {
        const data = {
          text: this.commentsOn
        };
        await this.$axios.$post(`text/commentsOn`, data);
      }
    },
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
      },
      async invalidateCache() {
        await this.$axios.$get('/cache/invalidate');
      }
    },
    async asyncData({ app }) {
      const chatOnResponse = await app.$axios.$get(`text/chatOn`);
      const commentsOnResponse = await app.$axios.$get(`text/commentsOn`);
      return {
        chatOn: chatOnResponse.value,
        commentsOn: commentsOnResponse.value
      };
    },
    middleware: 'admin'
  }
</script>

<style scoped>

</style>
