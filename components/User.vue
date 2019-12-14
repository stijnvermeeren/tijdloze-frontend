<template lang="pug">
  span.container
    span(@click.alt='showInfo = !showInfo' :class='{isAdmin: user.isAdmin}') {{user.displayName}}
    .info(v-if='showInfo')
      div Unieke ID: {{user.id}}
      div(v-if='user.isAdmin') Moderator
      div(v-if='currentUser.isAdmin && user.id !== currentUser.id && !user.isAdmin')
        div(v-if='!isBlocked')
          button(@click='block()' :disabled='blocking')
            | Blokkeren
        div(v-else)
          | Gebruiker geblokkeerd!
          button(@click='unblock()' :disabled='blocking')
            | Opnieuw toelaten
      div
        a(@click='showInfo = false') Sluiten
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
        return this.$store.state.auth.user;
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

      white-space: nowrap;
      font-size: 14px;

      div.close {
        text-align: right;
      }
    }
  }
</style>
