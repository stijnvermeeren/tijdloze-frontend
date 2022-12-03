<template lang="pug">
  div
    h2 Instellingen
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
        el-button(@click="invalidateCache" size="small") Invalidate API caches
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
    middleware: 'admin',
    head: {
      title: 'Admin: Instellingen'
    }
  }
</script>

<style scoped>

</style>
