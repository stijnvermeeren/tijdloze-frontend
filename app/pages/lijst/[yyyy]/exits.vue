<template lang="pug">
div(v-for='entry in exits' :key="entry.position")
  song-with-position(:song="entry.song")
    position-main(:position="entry.position")
    position-annotation in {{previousYear.yyyy}}
</template>

<script setup>
const props = defineProps({
  exits: Array,
  year: Object
})

const previousYear = computed(() => {
  return useYearStore().context.forYear(props.year).previous?.year
})
</script>