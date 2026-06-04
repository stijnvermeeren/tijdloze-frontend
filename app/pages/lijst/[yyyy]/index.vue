<template lang="pug">
  full-list(:list='list' :year='year' height="calc(100vh - 330px)")
</template>

<script setup lang="ts">
import {useRootStore} from "~/stores/root";
import type Year from '~/orm/Year'

const props = defineProps<{ year: Year }>()

const list = computed(() => useRootStore().list(props.year, 0, 0))
</script>