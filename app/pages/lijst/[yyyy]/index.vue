<template lang="pug">
  full-list(:list='list' :year='year')
</template>

<script setup>
import {useRootStore} from "~/stores/root";

const props = defineProps({
  year: Object
})

const list = useRootStore().list(props.year, 0, 0)
</script>