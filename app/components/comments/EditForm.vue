<template lang="pug">
div
  div
    v-textarea(
      :disabled='submitting'
      label='Reactie'
      rows="1"
      auto-grow
      v-model='editMessage'
      hide-details
      density="comfortable"
    )
  div
    v-btn.formsubmit(
      :prepend-icon="mdiSend"
      :disabled='submitting || invalidMessage' @click='submit()'
      density="comfortable"
    )
      | Bericht wijzigen
</template>

<script setup lang="ts">
import {mdiSend} from "@mdi/js";
import { apiEndpoints } from '~/api/endpoints'
const {$api} = useNuxtApp()
const emit = defineEmits(['submitted'])

const props = defineProps<{
  commentId: number
  message: string
}>()

const editMessage = ref(props.message)
const submitting = ref(false)

const invalidMessage = computed(() => {
  return editMessage.value.length === 0;
})

async function submit() {
  submitting.value = true;

  const data = {
    message: editMessage.value
  };
  await $api(apiEndpoints.comment.update(props.commentId), data)
  submitting.value = false;
  emit('submitted', editMessage.value)
}
</script>
