<template lang="pug">
comments-sheet(v-if="!isDeleted || isAdmin" :class="{'mine': isMine}")
  template(#header)
    span.name {{ comment.name }}
    span.created(:title="useDateFormat(comment.created)")
      | {{ useDateFormat(comment.created, {agoMaxDays: 7}) }}
    span.updated(v-if="showUpdated" :title="useDateFormat(comment.updated)")
      | (gewijzigd: {{ useDateFormat(comment.updated, {agoMaxDays: 7}) }})
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

  div.bericht {
    white-space: pre-wrap;
    overflow: auto;
  }

  .deleted {
    font-style: italic;
  }
</style>
