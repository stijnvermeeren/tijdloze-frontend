<template lang="pug">
div
  v-text-field(
    v-model="filterQuery"
    label="Zoeken in de lijst"
    persistent-placeholder
    hide-details
    clearable
    @click:clear="filterQuery = ''"
    density="compact"
  )
    template(#prepend-inner)
      v-icon(:icon="mdiMagnify")

div.fullList(v-if='filteredList.length > 0')
  div.listContainer(v-if='filteredList.length > 20' v-bind="containerProps" @scrollend="onScroll")
    div(v-bind="wrapperProps" ref="wrapper")
      div(v-for="{data: item} in virtualList" :key="item.position" style="height: 60px")
        song-with-position(:song="item.song" :attribution="item.attribution" :override-position="item.position" :year="year")
  div(v-else)
    song-with-position(
      v-for="entry in filteredList"
      :key="entry.position"
      :song="entry.song"
      :attribution="entry.attribution"
      :override-position="entry.position"
      :year="year"
    )

p(v-else)
  template(v-if="filterQuery") Geen passende nummers gevonden in de Tijdloze van {{year.yyyy}}.
  template(v-else="filterQuery") Nog geen nummers in de Tijdloze van {{year.yyyy}}.
</template>

<script setup>
import Year from "../orm/Year";
import {mdiMagnify} from "@mdi/js";
import { useVirtualList } from "@vueuse/core";

const props = defineProps({
  year: {
    type: Year
  },
  list: {
    type: Array
  }
})

const filterQuery = ref(useRoute().query.filter || '')
const scrollPosition = ref(parseInt(useRoute().query.positie) || 0)

function setQueryParams() {
  useRouter().replace({
    query: { 
      ...useRoute().query,
      filter: filterQuery.value || undefined,
      positie: scrollPosition.value || undefined
    }
  })
}

watch([filterQuery, scrollPosition], setQueryParams)

const filteredList = computed(() => {
  const queryFragments = useSearchQueryFragments(filterQuery.value)
  return props.list.filter(entry => useSearchFilter(queryFragments, useSearchSongContent)(entry.song))
})

const itemHeight = 60
const { list: virtualList, containerProps, wrapperProps, scrollTo } = useVirtualList(
  filteredList, {itemHeight}
)

watch(filterQuery, () => {
  scrollTo(0)
})

onActivated(() => {
  setQueryParams()
})  

onActivated(() => {
  if (scrollPosition.value) {
    const index = filteredList.value.findIndex(entry => entry.position === scrollPosition.value)
    if (index > -1) {
      scrollTo(index)
      // Slight offset, to make clear that we're not at the top
      containerProps.ref.value.scrollTop = containerProps.ref.value.scrollTop - 20
    }
  }
})

function onScroll() {
  const scrollTop = containerProps.ref.value?.scrollTop
  const scrollIndex = Math.ceil(scrollTop / itemHeight)
  if (scrollIndex) {
    scrollPosition.value = filteredList.value[scrollIndex].position
  } else {
    scrollPosition.value = undefined
  }
}

</script>

<style lang="scss">
div.listContainer {
  height: 560px;
}
</style>
