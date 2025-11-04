<template lang="pug">
Title {{year.yyyy}}
div
  div.flexTitle
    h2 De Tijdloze van {{year.yyyy}}
    div
      v-menu.downloadMenu
        template(v-slot:activator="{ props }")
          v-btn(v-bind="props" :icon="mdiDownload" rounded size="x-small")
        v-list(density="compact" :lines="false")
          v-list-item(link @click="download")
            v-list-item-title Download deze lijst ({{year.yyyy}}.tsv)
          v-list-item(to="/website/opendata")
            v-list-item-title Meer downloads
  ui-tabs(:tabs="tabs")
    nuxt-page(keepalive :year='year' :analysis='analysis' :exits="exits" :new-songs="newSongs")
</template>

<script setup>
import analyse from '~/utils/analyse';
import {useRootStore} from "~/stores/root";
import {sortBy} from 'ramda'
import {mdiDownload} from "@mdi/js";

definePageMeta({
  validate: async (route) => {
    return !! useYearStore().years.find(year => year.yyyy.toString() === route.params.yyyy);
  },
  noScrollDepth: 2
})

const {$api} = useNuxtApp()
const {currentYear, years, context} = storeToRefs(useYearStore())
const {listInProgress} = storeToRefs(useRootStore())

const yyyyParam = useRoute().params.yyyy
const analysisCurrentYear = ref('')
if (yyyyParam === currentYear.value.yyyy.toString()) {
  const analysisCurrentYearResponse = await $api(`text/analysis_${yyyyParam}`).catch(err => '');
  analysisCurrentYear.value = analysisCurrentYearResponse?.value ?? ''
}

const year = computed(() => {
  return years.value.find(year => year.yyyy.toString() === useRoute().params.yyyy);
})
const previousYear = computed(() => {
  return context.value.forYear(year.value).previous?.year
})

const top100 = computed(() => {
  return useRootStore().list(year.value, 100, 100);
})
const newSongs = computed(() => {
  if (previousYear.value) {
    return top100.value.filter(entry => !entry.song.position(previousYear.value));
  } else {
    return [];
  }
})

const exits = computed(() => {
  if (previousYear.value) {
    return sortBy(entry => entry.song.position(previousYear.value))(
      useRootStore().list(previousYear.value, 100, 100)
        .filter(entry => entry.song.notInList(year.value))
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
  if (year.value.equals(currentYear.value) && listInProgress.value) {
    tabs.push({ to: `/lijst/${year.value.yyyy}/opkomst`, title: 'Nog op komst?' })
  }
  return tabs
})

function download() {
  let output = 'positie\tartiest\ttweede artiest\ttitel\tjaartal\n';
  const list = useRootStore().list(year.value, 0, 0)
  for (const {position, song} of list) {
    output += `${position}\t${song.artist.name}\t${song.secondArtist?.name || ''}\t${song.title}\t${song.album.releaseYear}\n`
  }
  const blob = new Blob([output], { type: 'text/tab-separated-values;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${year.value.yyyy}.tsv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.downloadMenu .v-list-item-title {
  font-size: 0.8rem;
}
</style>