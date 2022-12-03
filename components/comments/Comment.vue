<template lang="pug">
  el-card(v-if="!isDeleted || isAdmin" :class="['comment', {'mine': isMine}]")
    div.reacinfo(slot="header")
      span.name {{ comment.name }}
      span.created {{ comment.created }}
      span.updated(v-if="showUpdated") (laatste wijziging: {{ comment.updated }})
      span.edit(v-if="isMine")
        a(@click="editComment") Wijzigen
      span.delete(v-if="!isDeleted && (isMine || isAdmin)")
        a(@click="deleteComment") Verwijderen
      span.delete(v-if="isDeleted && isAdmin")
        a(@click="restoreComment") Terugzetten
    div
      div.bericht(v-if="!editing") {{ message }}
      comment-edit-form(v-else :comment-id="comment.id" :message="message" @submitted="commentEdited")
</template>

<script>
  import CommentEditForm from "./CommentEditForm";

  export default {
    name: 'Comment',
    components: {CommentEditForm},
    props: {
      comment: Object
    },
    data() {
      return {
        isDeleted: !!this.comment.deleted,
        message: this.comment.message,
        editing: false
      }
    },
    computed: {
      isAuthenticated() {
        return this.$store.getters['auth/isAuthenticated'];
      },
      isAdmin() {
        return this.$store.getters['auth/isAdmin'];
      },
      isMine() {
        return this.isAuthenticated && this.$store.state.auth.user.id === this.comment.userId;
      },
      showUpdated() {
        function parseDate(dateString) {
          const parts = dateString.split(/[^0-9]+/g);
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
            this.$emit("deleted")
          });
        }
      },
      restoreComment() {
        if (confirm("Wil je dit bericht werkelijk terugzetten?")) {
          this.$axios.$post(`comment/${this.comment.id}`).then(response => {
            this.isDeleted = false;
            this.$emit("restored")
          });
        }
      }
    }
  }
</script>

<style lang="scss">
  .comment {
    .el-card__header {
      padding-top: 10px;
      padding-bottom: 10px;
    }

    .el-card__body {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
</style>

<style lang="scss" scoped>
  @use "../../assets/styleConfig";

  div.comment {
    margin: 1em 3em;

    border: 1px solid styleConfig.$inputBorderColor;
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
