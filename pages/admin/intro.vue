<template lang="pug">
  div
    h2 Homepage intro mode
    div
      button(@click='refresh()', :disabled='refreshing') Opnieuw laden
    select(v-model="mode")
      option(value="pre") Voor de uitzending
      option(value="during") Tijdens de uitzending
      option(value="none") (Geen intro)
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
        await this.$axios.$post(`text/intro`, data);
        await this.refresh();
        this.saving = false;
      },
      async refresh() {
        this.refreshing = true;
        const response = await this.$axios.$get(`text/intro`);
        this.mode = response.value;
        this.refreshing = false;
      }
    },
    async asyncData({ params, app }) {
      const response = await app.$axios.$get(`text/intro`);
      return {
        mode: response.value
      };
    },
    middleware: 'admin',
    head: {
      title: 'Admin: homepage intro mode'
    }
  }
</script>

<style lang="less" scoped>
</style>
