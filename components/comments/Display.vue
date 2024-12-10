<template lang="pug">
ui-card.comment(v-if="!isDeleted || isAdmin" :class="{'mine': isMine}")
  template(#title)
    div.reacinfo
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
    div.bericht(v-if="!editing") {{message.trim()}}
    comments-edit-form(v-else :comment-id="comment.id" :message="message" @submitted="commentEdited")
</template>

<script>
  import {useAuthStore} from "~/stores/auth";

  export default {
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
        return useAuthStore().isAuthenticated;
      },
      isAdmin() {
        return useAuthStore().isAdmin;
      },
      isMine() {
        return this.isAuthenticated && useAuthStore().user.id === this.comment.userId;
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
      async deleteComment() {
        if (confirm("Wil je dit bericht werkelijk verwijderen?")) {
          await $fetch(`comment/${this.comment.id}`, useFetchOptsDelete())
          this.isDeleted = true
          this.$emit("deleted")
        }
      },
      async restoreComment() {
        if (confirm("Wil je dit bericht werkelijk terugzetten?")) {
          await $fetch(`comment/${this.comment.id}`, useFetchOptsPost())
          this.isDeleted = false
          this.$emit("restored")
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @use "../../assets/styleConfig";

  .comment {
    margin: 1em 3em;

    &.mine {
      border-width: 4px;
    }

    div.reacinfo {
      margin-bottom: 0.2em;

      span.created, span.updated, span.edit, span.delete {
        margin-left: 2em;
        color: #444;
        font-size: 65%;
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
