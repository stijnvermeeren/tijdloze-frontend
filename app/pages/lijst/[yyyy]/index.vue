<template lang="pug">
  full-list(:list='list' :year='year' height="calc(100vh - 330px)")
</template>

<script setup>
import {useRootStore} from "~/stores/root";

const props = defineProps({
  year: Object
})

const list = computed(() => useRootStore().list(props.year, 0, 0))
</script>