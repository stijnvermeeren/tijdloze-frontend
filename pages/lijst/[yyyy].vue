<template lang="pug">
Title {{year.yyyy}}
div
  h2 De Tijdloze van {{year.yyyy}}

  ui-tabs(:tabs="tabs")
    nuxt-page(:year='year' :analysis='analysis' :exits="exits" :newSongs="newSongs")
</template>

<script setup>
import _ from 'lodash';
import analyse from '~/utils/analyse';

definePageMeta({
  validate: async (route) => {
    return !! useYearStore().years.find(year => year.yyyy.toString() === route.params.yyyy);
  }
})

const {$api} = useNuxtApp()
const {currentYear, years} = storeToRefs(useYearStore())

const yyyyParam = useRoute().params.yyyy
const analysisCurrentYear = ref('')
if (yyyyParam === currentYear.value.yyyy.toString()) {
  const analysisCurrentYearResponse = await $api(`text/analysis_${yyyyParam}`).catch(err => '');
  analysisCurrentYear.value = analysisCurrentYearResponse?.value ?? ''
}

const year = computed(() => {
  return years.value.find(year => year.yyyy.toString() === useRoute().params.yyyy);
})

const top100 = computed(() => {
  return useRootStore().list(year.value, 100, 100);
})
const newSongs = computed(() => {
  if (year.value.previous) {
    return top100.value.filter(entry => !entry.song.position(year.value.previous));
  } else {
    return [];
  }
})

const exits = computed(() => {
  if (year.value.previous) {
    return _.sortBy(
        useRootStore().list(year.value.previous, 100, 100)
            .filter(entry => entry.song.notInList(year.value)),
        entry => entry.song.position(year.value.previous)
    );
  } else {
    return [];
  }
})

const analysis = computed(() => {
  const item = analyse.find(item => item.yyyy === year.value.yyyy);
  if (item) {
    return item.analyse;
  } else {
    if (year.value.yyyy === currentYear.value?.yyyy && analysisCurrentYear.value) {
      return analysisCurrentYear.value.split(/\r?\n/);
    } else {
      return null;
    }
  }
})

const tabs = computed(() => {
  const tabs = [{ to: `/lijst/${year.value.yyyy}`, title: 'De lijst' }]
  if (exits.value.length) {
    tabs.push({ to: `/lijst/${year.value.yyyy}/exits`, title: 'Exits', subtitle: "top 100" })
  }
  if (newSongs.value.length) {
    tabs.push({ to: `/lijst/${year.value.yyyy}/nieuw`, title: 'Nieuwkomers', subtitle: "top 100" })
  }
  if (analysis.value) {
    tabs.push({ to: `/lijst/${year.value.yyyy}/analyse`, title: 'Analyse' })
  }
  return tabs
})
</script>
