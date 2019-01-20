<template lang="pug">
  div
    h2 Chat activeren
    div
      button(@click='refresh()', :disabled='refreshing') Opnieuw laden
    template(v-if="mode === 'chat'")
      h3 Chat actief
      div
        button(@click="save('comments')", :disabled='saving') Chat deactiveren
    template(v-else)
      h3 Chat niet actief
      div
        button(@click="save('chat')", :disabled='saving') Chat activeren
</template>

<script>
  export default {
    name: 'users',
    data() {
      return {
        refreshing: false,
        saving: false
      }
    },
    methods: {
      async save(mode) {
        this.saving = true;
        const data = {
          text: mode
        };
        await this.$axios.$post(`text/mode`, data);
        await this.refresh();
        this.saving = false;
      },
      async refresh() {
        this.refreshing = true;
        const response = await this.$axios.$get(`text/mode`);
        this.mode = response.value;
        this.refreshing = false;
      }
    },
    async asyncData({ params, app }) {
      const response = await app.$axios.$get(`text/mode`);
      return {
        mode: response.value
      };
    },
    middleware: 'admin',
    head: {
      title: 'Admin: chat activeren'
    }
  }
</script>

<style lang="less" scoped>
</style>
