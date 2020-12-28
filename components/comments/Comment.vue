<template lang="pug">
  div(:class="['reactie', {'mine': isMine}]")
    template(v-if="!isDeleted")
      .reacinfo
        span.name {{ comment.name }}
        span.created {{ comment.created }}
        span.delete(v-if="isMine")
          a(@click="deleteComment") Bericht verwijderen
      .bericht {{ comment.message }}
    div.deleted(v-else) Bericht verwijderd
</template>

<script>
  export default {
    name: 'Comment',
    props: ['comment'],
    data() {
      return {
        isDeleted: false,
      }
    },
    computed: {
      isAuthenticated() {
        return this.$store.getters['auth/isAuthenticated'];
      },
      isMine() {
        return this.isAuthenticated && this.$store.state.auth.user.id === this.comment.userId;
      }
    },
    methods: {
      deleteComment() {
        if (confirm("Wil je dit bericht werkelijk verwijderen?")) {
          this.$axios.$delete(`comment/${this.comment.id}`).then(response => {
            this.isDeleted = true;
          });
        }
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

      span.delete {
        margin-left: 1em;
        color: #888;
        font-size: 80%;
      }
    }

    div.bericht {
      white-space: pre-wrap;
      overflow: auto;
    }
  }

  div.deleted {
    font-style: italic;
  }
</style>
