<template lang="pug">
comments-sheet(v-if="!isDeleted || isAdmin" :class="{'mine': isMine}")
  template(#header)
    div.commentHeader
      user-avatar(v-if="comment.userId" :id="comment.userId" :user-name="comment.name" :is-admin="comment.isAdmin")
      span.legacyName(v-else) {{ comment.name }}
      span.created(v-tooltip="`Gepubliceerd: ${useDateFormat(comment.created)}`")
        | {{ createdAgo }}
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

<script setup lang="ts">
import {mdiDelete, mdiPencil, mdiRestore} from "@mdi/js";
import type { CommentItem } from '~/api/contracts'
import { apiEndpoints } from '~/api/endpoints'
import {useAuthStore} from "~/stores/auth";

const {$api} = useNuxtApp()
const emit = defineEmits(['deleted', 'restored'])

const props = defineProps<{
  comment: CommentItem
}>()

const agoMaxDays = 7
const createdAgo = computed(() => useDateFormat(props.comment.created, {agoMaxDays}))

const isDeleted = ref(!!props.comment.deleted)
const message = ref(props.comment.message)
const editing = ref(false)

const { isAuthenticated, isAdmin, user } = storeToRefs(useAuthStore())

const isMine = computed(() => {
  const userId = user.value?.id
  return isAuthenticated.value && userId === props.comment.userId;
})
const showUpdated = computed(() => {
  const differenceMillis = new Date(props.comment.updated).getTime() - new Date(props.comment.created).getTime();
  return differenceMillis > 10000;
})

function editComment() {
  editing.value = true;
}

function commentEdited(newMessage: string) {
  message.value = newMessage;
  editing.value = false;
}
async function deleteComment() {
  if (confirm("Wil je dit bericht werkelijk verwijderen?")) {
    await $api(apiEndpoints.comment.delete(props.comment.id))
    isDeleted.value = true
    emit("deleted")
  }
}
async function restoreComment() {
  if (confirm("Wil je dit bericht werkelijk terugzetten?")) {
    await $api(apiEndpoints.comment.restore(props.comment.id), undefined)
    isDeleted.value = false
    emit("restored")
  }
}

</script>

<style scoped>
  @import "../../assets/styleConfig.css";

  div.commentHeader {
    > * {
      vertical-align: middle
    }
    span.legacyName {
      font-weight: bold;
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
