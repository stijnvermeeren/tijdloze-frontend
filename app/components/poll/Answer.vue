<template lang="pug">
.answer(v-if='isAdmin && editing')
  v-text-field(v-model='answerEdit' density="compact" hide-details)
  v-btn(@click='send()' :disabled="submitting") Opslaan
  v-btn(@click='cancel()') Terug
div(v-else)
  .answer
    | {{answerEdit}}
    |
    v-btn(v-if='isAdmin' size="x-small" @click='editing = true') Aanpassen
</template>

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
const {$api} = useNuxtApp()

const props = defineProps<{
  pollId: number
  pollAnswerId: number
  isAdmin?: boolean
}>()

const answer = defineModel<string>()

const answerEdit = ref(answer.value)
const editing = ref(false)
const submitting = ref(false)

watch(answer, newValue => {
  answerEdit.value = newValue
})

async function send() {
  submitting.value = true;
  const data = {
    answer: answerEdit.value
  };
  await $api(apiEndpoints.poll.answer(props.pollId, props.pollAnswerId), data);
  answer.value = answerEdit.value;
  submitting.value = false;
  editing.value = false;
}

function cancel() {
  answerEdit.value = answer.value;
  editing.value = false;
}
</script>
