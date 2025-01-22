<template lang="pug">
Title Admin: huidige lijst
div
  h2 Admin: volledige lijst van dit jaar

  div(v-for="{position, song} in list")
    | {{song.position(currentYear, true)}}. {{song.artist.name}} - {{song.title}} (
    a(@click="remove(position, song)")
      | Uit lijst verwijderen
    | )
</template>

<script setup>
import {useRootStore} from "~/stores/root";

const {$api} = useNuxtApp()

definePageMeta({ middleware: 'admin' })

const {currentYear} = storeToRefs(useRootStore())

const list = computed(() => {
  return useRootStore().list(currentYear.value)
})

async function remove(position, song) {
  if (confirm(`"${song.artist.name} - ${song.title}" (positie ${position}) verwijderen uit de lijst van ${currentYear.value.yyyy})?`)) {
    await $api(`list-entry/${currentYear.value.yyyy}/${position}`, useFetchOptsDelete())
  }
}
</script>
