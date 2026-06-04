<template lang="pug">
div.d-flex(v-if='isAdmin && editing')
  v-text-field(v-model='questionEdit' density="compact" hide-details)
  v-btn(@click='send()' :disabled="submitting") Opslaan
  v-btn(@click='cancel()') Terug
div(v-else)
  .question
    | {{questionEdit}}
    |
    v-btn(v-if='isAdmin' @click='editing = true' size="x-small") Aanpassen
</template>

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
const {$api} = useNuxtApp()

const question = defineModel<string>({ required: true })

const props = defineProps<{
  pollId: number
  isAdmin?: boolean
}>()

const questionEdit = ref<string>(question.value)
const editing = ref(false)
const submitting = ref(false)

watch(question, newValue => {
  questionEdit.value = newValue
})

async function send() {
  submitting.value = true;
  const data = {
    question: questionEdit.value
  };
  await $api(apiEndpoints.poll.question(props.pollId), data);
  question.value = questionEdit.value
  submitting.value = false;
  editing.value = false;
}

function cancel() {
  questionEdit.value = question.value;
  editing.value = false;
}
</script>

<style scoped>
  div.question {
    font-weight: bold;
  }
</style>
