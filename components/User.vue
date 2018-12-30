<template>
  <span class="container">
    <span @click="showInfo = !showInfo" :class="{isAdmin: user.isAdmin}">{{user.displayName}}</span>
    <div v-if="showInfo" class="info">
      <div>Unieke ID: {{user.id}}</div>
      <div v-if="user.isAdmin">Moderator</div>
      <div v-if="currentUser.isAdmin && user.id !== currentUser.id && !user.isAdmin">
        <div v-if="!isBlocked">
          <button @click="block()" :disabled="blocking">
            Blokkeren
          </button>
        </div>
        <div v-else>
          Gebruiker geblokkeerd!
          <button @click="unblock()" :disabled="blocking">
            Opnieuw toelaten
          </button>
        </div>
      </div>
    </div>
  </span>
</template>

<script>
  export default {
    name: "User",
    props: ['user'],
    data() {
      return {
        showInfo: false,
        blocking: false,
        isBlocked: !!this.user.isBlocked
      }
    },
    computed: {
      currentUser() {
        return this.$store.state.user;
      }
    },
    watch: {
      user() {
        this.isBlocked = !!this.user.isBlocked;
      }
    },
    methods: {
      async block() {
        this.blocking = true;
        await this.$axios.$post(`/user/${this.user.id}/block`);
        this.isBlocked = true;
        this.blocking = false;
      },
      async unblock() {
        this.blocking = true;
        await this.$axios.$delete(`/user/${this.user.id}/block`);
        this.isBlocked = false;
        this.blocking = false;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~assets/globalStyles.less";

  span.container {
    position: relative;

    div.info {
      position: absolute;
      top: 1em;
      background-color: @inputBackgroundColor;
      border: 1px solid gray;
      border-radius: 4px;
      padding: 1px 4px;
      z-index: 1;
      text-align: left;
      font-weight: normal;
      color: black;
    }
  }
</style>
