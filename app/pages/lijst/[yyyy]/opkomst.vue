<template lang="pug">
Title Op komst
div
  p
    | De nummers die we dit jaar nog niet gehoord hebben, gesorteerd volgens hun positie in de lijst van vorig jaar.
  p.mb-5
    v-number-input(
      v-model="maxPosition"
      :label="`Maximale positie in ${previousYear.yyyy}`"
      :max="maxPositionLimit" :min="1"
      reverse
      :max-width="270"
    )
  full-list(:list='list' :year='previousYear')
</template>

<script setup>
const props = defineProps({
  year: Object
})

const maxPosition = ref(100)

const {context} = storeToRefs(useYearStore())

const previousYear = computed(() => {
  return context.value.forYear(props.year).previous?.year
})

const maxPositionLimit = computed(() => {
  const fullPreviousYearList = useRootStore().list(previousYear.value)
  return fullPreviousYearList?.[fullPreviousYearList.length - 1]?.position
})

const list = computed(() => {
  const previousYearList = useRootStore().list(previousYear.value, undefined, maxPosition.value)
  return previousYearList
    .filter(entry => !entry.song.position(props.year, true) && entry.song.probablyInList(props.year, true))
    .reverse()
})
</script>

<style scoped>

</style>
