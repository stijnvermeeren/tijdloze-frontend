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
definePageMeta({ middleware: 'admin' })
</script>

<script>
  import {useRootStore} from "~/stores/root";

  export default defineNuxtComponent({
    data() {
      return {
      }
    },
    computed: {
      currentYear() {
        return useRootStore().currentYear;
      },
      list() {
        return useRootStore().list(this.currentYear)
      }
    },
    methods: {
      async remove(position, song) {
        if (confirm(`"${song.artist.name} - ${song.title}" (positie ${position}) verwijderen uit de lijst van ${this.currentYear.yyyy})?`)) {
          await this.$api(`list-entry/${this.currentYear.yyyy}/${position}`, useFetchOptsDelete())
        }
      }
    }
  })
</script>
