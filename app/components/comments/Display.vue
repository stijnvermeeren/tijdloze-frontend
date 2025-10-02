<template lang="pug">
ui-card.comment(v-if="!isDeleted || isAdmin" :class="{'mine': isMine}")
  template(#title)
    div.reacinfo
      span.name {{ comment.name }}
      span.created(:title="useDateFormat(comment.created)")
        | {{ useDateFormat(comment.created, {agoMaxDays: 7}) }}
      span.updated(v-if="showUpdated" :title="useDateFormat(comment.updated)")
        | (gewijzigd: {{ useDateFormat(comment.updated, {agoMaxDays: 7}) }})
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
  const differenceMillis = new Date(props.comment.updated) - new Date(props.comment.created);
  return differenceMillis > 10000;
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
