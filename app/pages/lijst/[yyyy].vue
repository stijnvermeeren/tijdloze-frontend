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

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
import analyse from '~/utils/analyse';
import {useRootStore} from "~/stores/root";
import {mdiDownload} from "@mdi/js";
import type { ListEntry } from '~/stores/root'
import type Year from '~/orm/Year'

definePageMeta({
  validate: async (route) => {
    return !! useYearStore().years.find(year => year.yyyy.toString() === route.params.yyyy);
  },
  noScrollDepth: 2
})

const {$api} = useNuxtApp()
const {currentYear, years, context} = storeToRefs(useYearStore())
const {listInProgress} = storeToRefs(useRootStore())

const route = useRoute()
const routeYyyyParam = route.params.yyyy
const yyyyParam = Array.isArray(routeYyyyParam) ? routeYyyyParam[0] : routeYyyyParam
if (!yyyyParam) {
  throw createError({ statusCode: 404, statusMessage: 'Pagina niet gevonden' })
}

const analysisCurrentYear = ref('')
if (currentYear.value && yyyyParam === currentYear.value.yyyy.toString()) {
  const analysisCurrentYearResponse = await $api(apiEndpoints.text.analysis(Number(yyyyParam))).catch(() => null);
  analysisCurrentYear.value = analysisCurrentYearResponse?.value ?? ''
}

const year = computed<Year>(() => {
  const foundYear = years.value.find(year => year.yyyy.toString() === yyyyParam)
  if (!foundYear) {
    throw createError({ statusCode: 404, statusMessage: 'Pagina niet gevonden' })
  }
  return foundYear
})
const previousYear = computed(() => {
  return context.value.forYear(year.value).previous?.year
})

const top100 = computed<ListEntry[]>(() => {
  return useRootStore().list(year.value, 100, 100);
})
const newSongs = computed<ListEntry[]>(() => {
  if (previousYear.value) {
    const prev = previousYear.value
    return top100.value.filter(entry => !entry.song.position(prev));
  } else {
    return [];
  }
})

const exits = computed<ListEntry[]>(() => {
  if (previousYear.value) {
    const prev = previousYear.value
    return useRootStore().list(prev, 100, 100)
      .filter(entry => entry.song.notInList(year.value))
      .sort((a, b) => (a.song.position(prev) ?? Number.POSITIVE_INFINITY) - (b.song.position(prev) ?? Number.POSITIVE_INFINITY));
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
  const tabs: { to: string; title: string; subtitle?: string }[] = [{ to: `/lijst/${year.value.yyyy}`, title: 'De lijst' }]
  if (exits.value.length) {
    tabs.push({ to: `/lijst/${year.value.yyyy}/exits`, title: 'Exits', subtitle: "top 100" })
  }
  if (newSongs.value.length) {
    tabs.push({ to: `/lijst/${year.value.yyyy}/nieuw`, title: 'Nieuwkomers', subtitle: "top 100" })
  }
  if (analysis.value) {
    tabs.push({ to: `/lijst/${year.value.yyyy}/analyse`, title: 'Analyse' })
  }
  if (currentYear.value && year.value.equals(currentYear.value) && listInProgress.value) {
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