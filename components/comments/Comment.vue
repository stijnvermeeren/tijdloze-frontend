<template lang="pug">
  div(:class="['reactie', {'mine': isMine}]")
    template(v-if="!isDeleted")
      .reacinfo
        span.name {{ comment.name }}
        span.created {{ comment.created }}
        span.updated(v-if="showUpdated") (laatste wijziging: {{ comment.updated }})
        span.edit(v-if="isMine")
          a(@click="editComment") Wijzigen
        span.delete(v-if="isMine")
          a(@click="deleteComment") Verwijderen
      div.bericht(v-if="!editing") {{ message }}
      comment-edit-form(v-else :comment-id="comment.id" :message="message" @submitted="commentEdited")
    div.deleted(v-else) Bericht verwijderd
</template>

<script>
  import CommentEditForm from "./CommentEditForm";

  export default {
    name: 'Comment',
    components: {CommentEditForm},
    props: ['comment'],
    data() {
      return {
        isDeleted: false,
        message: this.comment.message,
        editing: false
      }
    },
    computed: {
      isAuthenticated() {
        return this.$store.getters['auth/isAuthenticated'];
      },
      isMine() {
        return this.isAuthenticated && this.$store.state.auth.user.id === this.comment.userId;
      },
      showUpdated() {
        function parseDate(dateString) {
          const regexp = /[0-9]+/g;

          const parts = [...dateString.matchAll(regexp)];
          return new Date(
              parseInt(parts[0]),
              parseInt(parts[1]) - 1,
              parseInt(parts[2]),
              parseInt(parts[3]),
              parseInt(parts[4]),
              parseInt(parts[5])
          )
        }

        const differenceMillis = parseDate(this.comment.updated) - parseDate(this.comment.created);
        return !this.isMine && differenceMillis > 10000;
      }
    },
    methods: {
      editComment() {
        this.editing = true;
      },
      commentEdited(newMessage) {
        this.message = newMessage;
        this.editing = false;
      },
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

      span.created, span.updated, span.edit, span.delete {
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
