<template lang="pug">
  span.container
    span(
      @click.ctrl='showInfo = !showInfo'
      @click.alt='showInfo = !showInfo'
      :class='{isAdmin: user.isAdmin}'
      ref="label"
    ) {{user.displayName}}
    .info(
      v-if='showInfo'
      :style="{ top: contextPosition.top, left: contextPosition.left }"
    )
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
        isBlocked: !!this.user.isBlocked,
        contextPosition: {
          top: 0,
          left: 0
        }
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
    },
    watch: {
      showInfo() {
        const boundingBox = this.$refs['label'].getBoundingClientRect()
        this.contextPosition = {
          top: boundingBox.bottom,
          left: boundingBox.left + 20
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~assets/globalStyles.less";

  span.container {

    div.info {
      position: absolute;
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
