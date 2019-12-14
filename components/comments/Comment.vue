<template lang="pug">
  div(:class="['reactie', {'mine': isMine}]")
    .reacinfo
      | {{ comment.name }} - {{ comment.created }}
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
    padding: 0.3em 4em;
    margin: 1em 0;

    &.mine {
      div.reacinfo {
        background-color: @headerBackgroundColor;
      }
    }

    div.reacinfo {
      background-color: #ccc;
      font-size: 90%;
      padding: 0.1em 0.2em;
      margin: 0.2em 0 0.4em 0;
      font-weight: bold;
      border-bottom: @blackLine;

      span {
        font-weight: bold;
      }
    }

    div.bericht {
      white-space: pre-wrap;
      overflow: auto;
    }
  }
</style>
