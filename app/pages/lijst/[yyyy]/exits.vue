<template lang="pug">
div(v-for='entry in exits' :key="entry.position")
  song-with-position(:song="entry.song" :year='year')
    position-main(:position="entry.position")
    position-annotation in {{previousYear.yyyy}}
</template>

<script setup lang="ts">
import type { ListEntry } from '~/stores/root'
import type Year from '~/orm/Year'

const props = defineProps<{ exits: ListEntry[]; year: Year }>()

const previousYear = computed<Year>(() => {
  const previous = useYearStore().context.forYear(props.year).previous?.year
  if (!previous) {
    throw createError({ statusCode: 404, statusMessage: 'Pagina niet gevonden' })
  }
  return previous
})
</script>