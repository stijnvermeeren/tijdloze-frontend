<template lang="pug">
comments-sheet(v-if="!isDeleted || isAdmin" :class="{'mine': isMine}")
  template(#header)
    div.commentHeader
      user-avatar(:id="comment.userId" :user-name="comment.name" :is-admin="comment.isAdmin")
      span.created(v-tooltip="`Gepubliceerd: ${useDateFormat(comment.created)}`")
        | {{ useDateFormat(comment.created, {agoMaxDays}) }}
      span.updated(v-if="showUpdated")
        | (
        span(v-tooltip="`Laatste wijziging: ${useDateFormat(comment.updated)}`") gewijzigd
        | )
      span.icons
        span(v-if="isMine")
          v-btn(:icon="mdiPencil" @click="editComment" title="Wijzigen" density="comfortable" size="x-small" color="blue" variant="outlined")
        span(v-if="!isDeleted && (isMine || isAdmin)")
          v-btn(:icon="mdiDelete" @click="deleteComment" title="Verwijderen" density="comfortable" size="x-small" color="orange" variant="outlined")
        span(v-if="isDeleted && isAdmin")
          v-btn(:icon="mdiRestore" @click="restoreComment" title="Terugzetten" density="comfortable" size="x-small" color="green" variant="outlined")
  div
    div.bericht(v-if="!editing") {{message.trim()}}
    comments-edit-form(v-else :comment-id="comment.id" :message="message" @submitted="commentEdited")
</template>

<script setup>
import {mdiDelete, mdiPencil, mdiRestore} from "@mdi/js";
import {useAuthStore} from "~/stores/auth";

const {$api} = useNuxtApp()
const emit = defineEmits(['deleted', 'restored'])

const props = defineProps({
  comment: Object
})

const agoMaxDays = 7

const isDeleted = ref(!!props.comment.deleted)
const message = ref(props.comment.message)
const editing = ref(false)

const { isAuthenticated, isAdmin, user } = storeToRefs(useAuthStore())

const isMine = computed(() => {
  return isAuthenticated.value && user.value.id === props.comment.userId;
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

  div.commentHeader {
    > * {
      vertical-align: middle
    }
    span.created {
      margin-left: 30px;
      color: #444;
    }
    span.updated {
      margin-left: 10px;
      color: #444;
    }

    span.icons {
      margin-left: 20px;
      span {
        margin-left: 10px;
      }
    }
  }

  div.bericht {
    white-space: pre-wrap;
    overflow: auto;
  }

  .deleted {
    font-style: italic;
  }
</style>
