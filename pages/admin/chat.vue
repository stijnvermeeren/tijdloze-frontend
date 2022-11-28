<template lang="pug">
  div
    h2 Chat / reacties mode
    div
      button(@click='refresh()', :disabled='refreshing') Opnieuw laden
    select(v-model="mode")
      option(value="chat") Chat
      option(value="comments") Reacties
      option(value="none") Geen interacties mogelijk
    button(@click="save()", :disabled='saving') Opslaan
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
      async save() {
        this.saving = true;
        const data = {
          text: this.mode
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

<style lang="scss" scoped>
</style>
