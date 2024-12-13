<template lang="pug">
ui-card(v-if="crawl")
  template(#title)
    artist-link(v-if="type === 'artist'" :artist="storeModel")
    album-link(v-if="type === 'album'" :album="storeModel")
    span : {{crawl.field}}
  template(#subtitle)
    div Gecrawled: {{crawl.crawlDate}}
    div Kommentaar: {{crawl.comment}}
  template(#buttons)
    v-btn(@click="accept(crawl.id)" color="green" :disabled="submitting") Accepteren
    v-btn(@click="reject(crawl.id)" color="amber" :disabled="submitting") Afwijzen
  div
    div
      h4 Nieuwe waarde
      admin-link-with-preview(
        v-if="crawl.value"
        :type="type"
        :field="crawl.field"
        :value="crawl.value"
      )
      span(v-else) (Geen waarde)
    div
      h4 Huidige waarde
      admin-link-with-preview(
        v-if="currentValue"
        :type="type"
        :field="crawl.field"
        :value="currentValue"
      )
      span(v-else) (Geen waarde)

div(v-else) Niets meer gevonden...
</template>

<script setup>
import {useRepo} from "pinia-orm";
import Artist from "~/orm/Artist";
import Album from "~/orm/Album";

const {$api} = useNuxtApp()

const props = defineProps({
  type: String
})

const apiPath = `crawl-${props.type}`
const idSelector = `${props.type}Id`
const repoModel = function(){
  switch(props.type) {
    case "artist": return Artist
    case "album": return Album
  }
}()

const submitting = ref(false)

const {data: crawl, refresh: refreshCrawl} = await useFetch(apiPath, useFetchOpts())
const modelFetchPath = computed(() => {
  const modelId = crawl?.value?.[idSelector]
  return modelId ? `${props.type}/${modelId}` : undefined
})
const {data: model} = await useFetch(modelFetchPath, useFetchOpts())

const currentValue = computed(() => {
  return model?.value?.[crawl?.value?.field]
})

const storeModel = computed(() => {
  if (crawl.value) {
    return useRepo(repoModel).find(crawl.value[idSelector])
  } else {
    return undefined
  }
})

async function refresh() {
  await refreshCrawl()
}

async function accept(id) {
  submitting.value = true
  await $api(`${apiPath}/${id}`, useFetchOptsPost())
  refresh()
  submitting.value = false
}

async function reject(id) {
  submitting.value = true
  await $api(`${apiPath}/${id}`, useFetchOptsDelete())
  refresh()
  submitting.value = false
}
</script>
