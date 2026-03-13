<template lang="pug">
div(v-for='entry in newSongs' :key="entry.position")
  song-with-position(:song="entry.song" :year='year')
    position-main(:position='entry.position')
    position-annotation(v-if='entry.song.isReEntry(year)') re-entry
</template>

<script setup lang="ts">
import type { ListEntry } from '~/stores/root'
import type Year from '~/orm/Year'

defineProps<{ newSongs: ListEntry[]; year: Year }>()
</script>