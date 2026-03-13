<template lang="pug">
Title Admin: huidige lijst
div
  h2 Admin: volledige lijst van dit jaar

  template(v-if='currentYear')
    div(v-for="{position, song} in list")
      | {{song.position(currentYear, true)}}. {{song.artist.name}} - {{song.title}} (
      a(@click="remove(position, song)")
        | Uit lijst verwijderen
      | )
</template>

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
import Song from '~/orm/Song'
import {useRootStore} from "~/stores/root";

const {$api} = useNuxtApp()

definePageMeta({ middleware: 'admin' })

const {currentYear} = storeToRefs(useYearStore())

const list = computed(() => {
  if (!currentYear.value) {
    return []
  }
  return useRootStore().list(currentYear.value)
})

async function remove(position: number, song: Song) {
  if (!currentYear.value) {
    return
  }
  if (confirm(`"${song.artist.name} - ${song.title}" (positie ${position}) verwijderen uit de lijst van ${currentYear.value.yyyy})?`)) {
    await $api(apiEndpoints.listEntry.delete(currentYear.value.yyyy, position))
  }
}
</script>
