<template>
  <div>
    <h2>Chat activeren</h2>

    <div>
      <button @click="refresh()" :disabled="refreshing">Opnieuw laden</button>
    </div>

    <template v-if="mode == 'chat'">
      <h3>Chat actief</h3>
      <div><button @click="save('comments')" :disabled="saving">Chat deactiveren</button></div>
    </template>
    <template v-else>
      <h3>Chat niet actief</h3>
      <div><button @click="save('chat')" :disabled="saving">Chat activeren</button></div>
    </template>
  </div>
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
