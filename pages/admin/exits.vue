<template lang="pug">
Title Admin: Exits markeren
div
  h2 Exits markeren ({{currentYear.yyyy}})
  div
    search-box(
      :placeholder='`Zoek nummer uit de Tijdloze van ${previousYear.yyyy}`'
      :song-filter='songValid', :songs-year='previousYear'
      :album-filter='album => false'
      :artist-filter='artist => false'
      @selectSearchResult='markExit($event.item)'
    )

  div(v-if='exits.length')
    h3 Exits
    div
      ul
        li(v-for='song in exits', :key='song.id')
          | {{song.artist.fullName}}
          template(v-if='song.secondArtist')
            |
            | en {{song.secondArtist.fullName}}
          |
          | - {{song.title}}
          v-btn(@click='unmarkExit(song)') Terugzetten
      div
        v-btn(@click='unmarkAll()') Alle exits terugzetten
</template>

<script setup>
definePageMeta({ middleware: 'admin' })
</script>

<script>
  import Song from '~/orm/Song'
  import {useRootStore} from "~/stores/root";
  import {useRepo} from "pinia-orm";

  export default defineNuxtComponent({
    name: 'exits',
    computed: {
      exitSongIds() {
        return useRootStore().exitSongIds;
      },
      exits() {
        return this.exitSongIds.map(id => {
          return useRepo(Song).with('artist').with('secondArtist').find(id)
        });
      },
      previousYear() {
        return this.currentYear.previous();
      },
      currentYear() {
        return useRootStore().currentYear;
      }
    },
    methods: {
      songValid(song) {
        const inPreviousYear = song.position(this.previousYear);

        const notYetInCurrentYear = this.currentYear ? !song.position(this.currentYear) : true;
        const notYetMarked = !this.exitSongIds.includes(song.id);
        return inPreviousYear && notYetInCurrentYear && notYetMarked;
      },
      async unmarkAll() {
        await useApiFetchDelete(`/list-exit/${this.currentYear.yyyy}`);
      },
      async unmarkExit(song) {
        await useApiFetchDelete(`/list-exit/${this.currentYear.yyyy}/${song.id}`);
      },
      async markExit(song) {
        await useApiFetchPost(`/list-exit/${this.currentYear.yyyy}/${song.id}`);
      }
    }
  })
</script>

