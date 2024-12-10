<template lang="pug">
Title Admin: Polls
div
  div.flexTitle
    h2 Admin: polls
    v-btn(@click='refresh()' :disabled='refreshing' size="small" rounded) Opnieuw laden
  ui-card(:title="`Maak een nieuwe poll (${currentYear.yyyy})`")
    div
      h4 Vraag
      div
        v-text-field(v-model='question' hide-details density="compact")
      h4.mt-4
        span.mr-4 Antwoorden
        v-btn(@click="answers.push({text: ''})" size="x-small") Nog een antwoord
        v-btn(v-if='answers.length > 2' @click='answers.pop()' size="small") Laatste antwoord verwijderen
      ul(v-for='answer in answers')
        li
          v-text-field(v-model='answer.text' hide-details density="compact")
      div
        v-btn(@click='submit()' :disabled='!formValid' type="primary") Opslaan

  ui-card(v-for='{year, polls} in groupedPolls' :key="year" :title="`${year}`")
    div(v-for='poll in polls', :key='poll.id')
      poll(:poll='poll', :is-admin='true')
</template>

<script setup>
import {useRootStore} from "~/stores/root";

definePageMeta({ middleware: 'admin' })

const refreshing = ref(false)
const question = ref('')
const answers = ref([{text: ''}, {text: ''}])
const submitting = ref(false)

const {data: polls, refresh: refreshPolls} = await useFetch(`poll/list`, useFetchOpts())

const currentYear = computed(() => {
  return useRootStore().currentYear;
})

const groupedPolls = computed(() => {
  const pollYears = useRootStore().years.filter(year => parseInt(year.yyyy) >= 2015);
  return pollYears.reverse().map(year => {
    return {
      year: year.yyyy,
      polls: polls.value.filter(poll => poll.year === year.yyyy)
    }
  })
})

const formValid = computed (() => {
  return !submitting.value && question.value && answers.value.every(answer => answer.text);
})

async function refresh() {
  refreshing.value = true;
  await refreshPolls()
  refreshing.value = false;
}

async  function submit() {
  submitting.value = true;
  const data = {
    question: question.value,
    answers: answers.value.map(answer => answer.text),
    year: currentYear.value.yyyy
  };
  await $fetch('poll', useFetchOptsPost(data));
  await this.refresh();
  question.value = '';
  answers.value = [{text: ''}, {text: ''}];
  submitting.value = false;
}
</script>
