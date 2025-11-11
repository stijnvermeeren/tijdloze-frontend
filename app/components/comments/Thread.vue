<template lang="pug">
div.thread
  comments-display(:comment="threadSummary.mainComment" @deleted="emit('updated')")
  div
    div.indent(v-if="!isExpanded")
      v-btn(
        :prepend-icon="mdiDotsVertical"
        @click="expand"
        v-if="unloadedReplyCount > 0"
        :disabled="fullCommentStatus === 'pending'"
        density="comfortable"
      ) Nog {{unloadedReplyCount}} antwoord{{ unloadedReplyCount === 1 ? "" : "en" }} tonen
    comments-display-reply(v-for="reply in shownReplies" :key="reply.id")
      comments-display.flex-grow-1(:comment="reply" @deleted="updated")
    v-btn.indent(v-if="!replying" :prepend-icon="mdiMessageReplyText" @click="replying = true" density="comfortable") Beantwoorden
    comments-display-reply(v-if="replying")
      comments-form.flex-grow-1(expanded :parent-id="threadSummary.mainComment.id" @submitted="submitted")
</template>

<script setup>
import { mdiMessageReplyText, mdiDotsVertical } from '@mdi/js';

const {$api} = useNuxtApp()
const emit = defineEmits(["updated"])
const props = defineProps({
  threadSummary: Object
})
const replying = ref(false)
const isExpanded = ref(false)
const initialReplyCount = 2
const {data: fullComment, refresh: fullCommentRefresh, status: fullCommentStatus} = useFetch(
    `comment/${props.threadSummary.mainComment.id}/full`,
    useFetchOpts({
      immediate: false
    })
)
async function expand() {
  await fullCommentRefresh()
  isExpanded.value = true
}
const shownReplies = computed(() => {
  if (fullComment.value) {
    if (isExpanded.value) {
      return fullComment.value.replies
    } else {
      return fullComment.value.replies.slice(fullComment.value.replies.length - initialReplyCount)
    }
  } else {
    return [props.threadSummary.lastReply2, props.threadSummary.lastReply1].filter(x => x)
  }
})
const replyCount = computed(() => {
  if (fullComment.value) {
    return fullComment.value.replies.length
  } else {
    return props.threadSummary.replyCount
  }
})
const unloadedReplyCount = computed(() => {
  return Math.max(0, replyCount.value - initialReplyCount)
})
async function updated() {
  await fullCommentRefresh()
}
async function submitted() {
  await updated()
  replying.value = false
}
</script>

<style lang="scss" scoped>
div.thread {
  max-width: 780px;
  margin: 1em auto;

  .indent {
    margin-left: 4em;
  }
}
</style>