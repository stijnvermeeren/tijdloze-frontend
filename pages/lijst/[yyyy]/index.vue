<template lang="pug">
client-only(placeholder="Loading...")
  full-list(:songs='songsExtended' :year='year')
</template>

<script setup>
import {useRootStore} from "~/stores/root";

const props = defineProps({
  songs: Object,
  year: Object
})

const songsExtended = useRootStore().list(props.year)
</script>