<template lang="pug">
Title Admin: interessante feiten {{currentYearYyyy}}
div
  h2 "Interessante feiten" {{currentYearYyyy}}

  ui-card(title="Aanpassen")
    ui-alert
      div Link naar nummer of artiest:
        |
        code [The Chain]
        |
        | wordt
        |
        make-links(text="[The Chain]")
      div Als de titel niet eenduidig is, voeg dan de artiest toe na een puntkomma:
        |
        code [One;Metallica]
        |
        | wordt
        |
        make-links(text="[One;Metallica]")
      div Een ster in het begin maakt de link vetgedrukt:
        |
        code [*Pink Floyd]
        |
        | wordt
        |
        make-links(text="[*Pink Floyd]")
      div HTML werkt ook (gebruik voorzichtig en met mate):
        |
        code {{textExample}}
        |
        | wordt
        |
        make-links(:text="textExample")
    div
      v-textarea(v-model='analysis' :rows="10")
    div(v-if="outOfDate && !refreshing")
      | Opgelet! De tekst werd reeds door een andere Admin gewijzigd!
      |
      v-btn(@click='refresh()' :disabled='refreshing') Opnieuw laden
    div
      v-btn(@click='save()' :disabled='saving') Opslaan

  ui-card(title="Preview")
    div
      .analyse
        ul
          li(v-for='text in analysisPreview')
            make-links(:text='text')
</template>

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
import { analysisKey } from '~/api/endpoints/text'
import Year from '~/orm/Year'
const {$api} = useNuxtApp()

definePageMeta({
  middleware: 'admin'
})

const textExample = "<strong>vet</strong> <em>scheef</em>"

const {currentYear} = storeToRefs(useYearStore())
const currentYearValue = computed<Year>(() => currentYear.value ?? new Year(new Date().getFullYear()))
const currentYearYyyy = computed(() => currentYearValue.value.yyyy)

const {data: lastLoadedAnalysis, refresh: refreshLastLoaded} = await useApiFetch(
  () => apiEndpoints.text.byKey(analysisKey(currentYearValue.value))
);
const initialAnalysis = ref(lastLoadedAnalysis.value?.value)

const refreshing = ref(false)
const saving = ref(false)
const interval = ref<ReturnType<typeof setInterval> | undefined>(undefined)
const analysis = ref(initialAnalysis.value ?? '')


const outOfDate = computed(() => {
  return lastLoadedAnalysis.value?.value !== initialAnalysis.value;
})
const analysisPreview = computed(() => {
  if (analysis.value) {
    return analysis.value.split(/\r?\n/);
  } else {
    return [];
  }
})
async function save() {
  saving.value = true;  await $api(apiEndpoints.text.updateByKey(analysisKey(currentYearValue.value)), { text: analysis.value });
  await refresh()
  saving.value = false;
}
async function refresh() {
  refreshing.value = true;
  await refreshLastLoaded()
  analysis.value = lastLoadedAnalysis.value?.value ?? '';
  initialAnalysis.value = lastLoadedAnalysis.value?.value ?? '';
  refreshing.value = false;
}

onMounted(() => {
  interval.value = setInterval(refreshLastLoaded, 10000);
})
onBeforeUnmount(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }
})
</script>

<style scoped>
  div.analyse {
    font-size: 14px;
  }

  code {
    background-color: #ddd;
    margin-left: 10px;
  }
</style>
