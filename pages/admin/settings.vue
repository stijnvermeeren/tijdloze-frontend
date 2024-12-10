<template lang="pug">
Title Admin: Instellingen
div
  h2 Instellingen
  div
    v-switch(v-model="commentsOn" :true-value="'on'" :false-value="'off'" label="Reacties open" hide-details)
  div
    v-switch(v-model="chatOn" :true-value="'on'" :false-value="'off'" label="Chatbox open" hide-details)
  div
    v-btn(@click="invalidateCache") Invalidate API caches
</template>

<script>
  import SearchBox from '../../components/SearchBox'
  export default defineNuxtComponent({
    setup() {
      definePageMeta({
        middleware: 'admin'
      })
    },
    watch: {
      async chatOn() {
        const data = {
          text: this.chatOn
        };
        await $fetch(`text/chatOn`, useFetchOpts(useFetchData(data, {method: 'POST'})));
      },
      async commentsOn() {
        const data = {
          text: this.commentsOn
        };
        await $fetch(`text/commentsOn`, useFetchOpts(useFetchData(data, {method: 'POST'})));
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
          useRouter().push(path);
        }
      },
      async invalidateCache() {
        await $fetch('/cache/invalidate', useFetchOpts());
      }
    },
    async asyncData() {
      const chatOnResponse = await $fetch(`text/chatOn`, useFetchOpts());
      const commentsOnResponse = await $fetch(`text/commentsOn`, useFetchOpts());
      return {
        chatOn: chatOnResponse.value,
        commentsOn: commentsOnResponse.value
      };
    }
  })
</script>

<style scoped>

</style>
