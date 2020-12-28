<template lang="pug">
  div(:class="['reactie', {'mine': isMine}]")
    .reacinfo
      span.name {{ comment.name }}
      span.created {{ comment.created }}
    .bericht {{ comment.message }}
</template>

<script>
  export default {
    name: 'Comment',
    props: ['comment'],
    computed: {
      isAuthenticated() {
        return this.$store.getters['auth/isAuthenticated'];
      },
      isMine() {
        return this.isAuthenticated && this.$store.state.auth.user.id === this.comment.userId;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~assets/globalStyles.less";

  div.reactie {
    padding: 0.3em 1em;
    margin: 0.7em 3em;

    border: 1px solid @inputBorderColor;
    border-radius: 4px;

    &.mine {
      border-width: 3px;
    }

    div.reacinfo {
      margin-bottom: 0.2em;

      span.name {
        font-weight: bold;
      }

      span.created {
        margin-left: 1em;
        color: #888;
      }
    }

    div.bericht {
      white-space: pre-wrap;
      overflow: auto;
    }
  }
</style>
