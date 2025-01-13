<template lang="pug">
div
  div
    v-textarea(
      :disabled='submitting'
      label='Reactie'
      rows='4'
      v-model='editMessage'
      hide-details
    )
  div
    v-btn.formsubmit(:disabled='submitting || invalidMessage' @click='submit()')
      | Bericht wijzigen
</template>

<script setup>
const {$api} = useNuxtApp()
const emit = defineEmits(['submitted'])

const props = defineProps({
  commentId: Number,
  message: String
})

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
  await $api(`comment/${props.commentId}`, useFetchOptsPut(data))
  submitting.value = false;
  emit('submitted', editMessage.value)
}
</script>
