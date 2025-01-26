<template lang="pug">
v-sheet.comment(v-if="!isDeleted || isAdmin" :class="{'mine': isMine}" :elevation="1" rounded outlined)
  div.commentHeader
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

<script setup>
import {useAuthStore} from "~/stores/auth";

const {$api} = useNuxtApp()
const emit = defineEmits(['deleted', 'restored'])

const props = defineProps({
  comment: Object
})

const isDeleted = ref(!!props.comment.deleted)
const message = ref(props.comment.message)
const editing = ref(false)

const isAuthenticated = computed(() => {
  return useAuthStore().isAuthenticated;
})
const isAdmin = computed(() => {
  return useAuthStore().isAdmin;
})
const isMine = computed(() => {
  return isAuthenticated.value && useAuthStore().user.id === props.comment.userId;
})
const showUpdated = computed(() => {
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

  const differenceMillis = parseDate(props.comment.updated) - parseDate(props.comment.created);
  return !isMine.value && differenceMillis > 10000;
})

function editComment() {
  editing.value = true;
}

function commentEdited(newMessage) {
  message.value = newMessage;
  editing.value = false;
}
async function deleteComment() {
  if (confirm("Wil je dit bericht werkelijk verwijderen?")) {
    await $api(`comment/${props.comment.id}`, useFetchOptsDelete())
    isDeleted.value = true
    emit("deleted")
  }
}
async function restoreComment() {
  if (confirm("Wil je dit bericht werkelijk terugzetten?")) {
    await $api(`comment/${props.comment.id}`, useFetchOptsPost())
    isDeleted.value = false
    emit("restored")
  }
}
</script>

<style lang="scss" scoped>
  @use "../../assets/styleConfig";

  .comment {
    padding: 0.5em 2em;
    margin-bottom: 2px;

    &.mine {
      .commentHeader span.name {
        font-style: italic;
      }
    }

    div.commentHeader {
      margin-bottom: 0.2em;

      span.name {
        font-weight: bold;
      }

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
