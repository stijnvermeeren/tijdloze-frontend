<template lang="pug">
div.thread
  comments-display(:comment="threadSummary.mainComment" @deleted="emit('updated')")
  div
    div.indent(v-if="!isExpanded")
      v-btn(
        @click="expand"
        v-if="unloadedReplyCount > 0"
        :disabled="fullCommentStatus === 'pending'"
        density="comfortable"
      ) Nog {{unloadedReplyCount}} antwoord{{ unloadedReplyCount === 1 ? "" : "en" }} tonen
    comments-display-reply(v-for="reply in shownReplies" :key="reply.id" :comment="reply" @deleted="updated")
    div.indent
      v-btn(v-if="!replying" @click="replying = true" density="comfortable") Beantwoorden
      comments-form(v-if="replying" expanded :parent-id="threadSummary.mainComment.id" @submitted="submitted")
</template>

<script setup>
import _ from 'lodash';
import * as repl from "node:repl";

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
      return _.takeRight(fullComment.value.replies, initialReplyCount)
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
  margin: 1em 3em;

  .indent {
    margin-left: 4em;
  }
}
</style>
