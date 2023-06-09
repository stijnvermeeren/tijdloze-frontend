<template lang="pug">
Title Admin: nummers toevoegen
div
  div.flexTitle
    h2 Admin: nummers toevoegen
    div
      nuxt-link(to="/admin/lijst")
        v-btn(color="amber" rounded size="small") Nummers verwijderen uit de lijst

  ui-alert(v-if='previousSong'
    type="success"
    :title="`Net toegevoegd op positie ${previousPosition} in ${currentYear.yyyy}`"
  )
    div
      | {{ previousSong.artist.fullName }}
      template(v-if='previousSong.secondArtist')
        |
        | en {{previousSong.secondArtist.fullName}}
      |
      | - {{ previousSong.title }}
      |
      v-btn(@click='undo()' :disabled='processing' rounded size="small") Ongedaan maken

  v-btn(v-if='!lastSong' @click='deleteYear' rounded color="warning")
    | Jaar {{currentYear.yyyy}} starten ongedaan maken

  v-btn(v-if='lastPosition === 1 && nextYearYyyy !== currentYear.yyyy' @click='startYear' rounded color="blue")
    | Jaar {{nextYearYyyy}} starten

  ui-card(title="Volgend nummer")
    div
      v-text-field.d-inline-block(
        v-model.number="nextPosition"
        :label="`Positie in ${currentYear.yyyy}`"
        type="number"
        hide-details
      )

    div.query(v-if="importQuery")
      | Importeren van "{{importQuery}}".
      =" "
      v-btn(
        size="small"
        rounded
        :prepend-icon="mdiSearchWeb"
        :href="`https://www.google.com/search?q=${encodeURIComponent(importQuery)}`"
        target="_blank"
      ) Zoek info op Google

    div(v-show="nextPosition > 0")
      v-btn-toggle.mt-2.mb-3(v-model="nextSongTab" color="blue")
        v-btn(value="existing") Nummer uit de database
        v-btn(value="spotify") Nieuw nummer (via Spotify)
        v-btn(value="manual") Nieuw nummer (manueel)

      div(v-show="nextSongTab === 'existing'")
        search-box(
          placeholder='Zoek nummer...'
          :artist-filter='artist => false'
          :album-filter='album => false'
          :song-filter='possibleSong'
          :songs-year='previousYear'
          :initial-query='importQuery'
          @selectSearchResult='selectSearchResult($event)'
          @initialResultCount="initialResultCount($event)"
        )

        div(v-if="nextSong")
          div
            strong {{nextSong.artist.fullName}} - {{nextSong.title}}
            |  (in {{previousYear.yyyy}} op positie #[position(:year='previousYear', :song='nextSong')])
          div(v-if='nextSongFullData && nextSongFullData.spotifyId')
            spotify(:spotify-id='nextSongFullData.spotifyId')
          div
            v-btn(@click='add(nextSong.id)' :disabled='!nextValid' rounded)
              | Toevoegen op positie {{nextPosition}} in {{currentYear.yyyy}}

      div(v-show="nextSongTab === 'spotify'")
        admin-spotify-search(:initialQuery='importQuery' @selectSpotifyTrack='selectSpotifyTrack($event)')
        div(v-if='spotifyData')
          hr
          admin-new-song-wizard(
            :preset='spotifyData'
            :button-label='`Toevoegen op positie ${nextPosition} in ${currentYear.yyyy}`'
            @newSong='add($event.id)'
          )

      div(v-show="nextSongTab === 'manual'")
        admin-new-song-wizard(
          :button-label='`Toevoegen op positie ${nextPosition} in ${currentYear.yyyy}`'
          @newSong='add($event.id)'
        )

  ui-card(:title="`Tijdloze ${currentYear.yyyy}: import`")
    template(#buttons)
      v-btn(v-if="importSongs.length" @click="cancelImport" color="amber" rounded size="small") Import annuleren
    div(v-if="importSongs.length")
      div In de wachtrij om geïmporteerd te worden...
      div(v-for="{overridePosition, query} in importSongs")
        strong {{overridePosition}}.
        =" "
        span {{query}}
    div(v-else)
      admin-import-form(:startPosition="nextPosition" @startImport="startImport")
</template>

<script setup>
definePageMeta({ middleware: 'admin' })
</script>

<script>
  import Song from "@/orm/Song";
  import {useRootStore} from "~/stores/root";
  import {mdiSearchWeb} from "@mdi/js";
  import {useRepo} from "pinia-orm";

  export default defineNuxtComponent({
    data() {
      return {
        nextSongTab: 'existing',
        nextSong: undefined,
        nextSongFullData: undefined,
        processing: false,
        spotifyData: undefined,
        importQuery: '',
        importSongs: [],
        nextPosition: useRootStore().lastPosition ? useRootStore().lastPosition - 1 : 100,
        previousPosition: undefined,
        mdiSearchWeb
      }
    },
    computed: {
      currentYear() {
        return useRootStore().currentYear;
      },
      previousYear() {
        return this.currentYear.previous();
      },
      lastSong() {
        return useRootStore().lastSong;
      },
      lastPosition() {
        return useRootStore().lastPosition
      },
      nextYearYyyy() {
        return (new Date()).getFullYear();
      },
      nextPositionAuto() {
        return this.lastPosition ? this.lastPosition - 1 : 100;
      },
      previousSong() {
        if (this.previousPosition) {
          return useRepo(Song).withAll().get().find(song => song.position(this.currentYear, true) === this.previousPosition)
        } else {
          return undefined
        }
      },
      nextValid() {
        if (this.nextSongTab === 'existing') {
          return !!this.nextSong
        } else {
          return true
        }
      }
    },
    watch: {
      nextPositionAuto(newValue) {
        if (!this.importQuery) {
          this.nextPosition = newValue
        }
      }
    },
    methods: {
      initialResultCount(count) {
        this.nextSongTab = (this.importQuery && count === 0) ? 'spotify' : 'existing';
      },
      loadNextFromImport() {
        let canBeImported = false;
        let nextImport = this.importSongs.shift();
        while (!canBeImported && nextImport) {
          const {overridePosition, query} = nextImport;
          if (!overridePosition || !useRootStore().songs.find(song => song.position(this.currentYear, true) === overridePosition)) {
            this.importQuery = query;
            this.nextPosition = overridePosition;
            canBeImported = true;
          } else {
            nextImport = this.importSongs.shift()
          }
        }
        if (!canBeImported) {
          this.importQuery = ''
          this.nextPosition = this.nextPositionAuto
        }
      },
      startImport(songs) {
        this.importSongs = songs
        this.loadNextFromImport();
      },
      cancelImport() {
        this.importSongs = []
      },
      async selectSearchResult(result) {
        this.nextSong = result.item;
        this.nextSongFullData = undefined;
        const { data } = await useApiFetch(`song/${this.nextSong.id}`)
        this.nextSongFullData = data;
      },
      selectSpotifyTrack(track) {
        this.spotifyData = {
          songTitle: this.clean(track.title),
          artistName: track.artist,
          albumTitle: this.clean(track.album),
          albumYear: track.year,
          spotifyId: track.spotifyId
        };
      },
      async undo() {
        this.processing = true;
        await useApiFetchDelete(`list-entry/${this.currentYear.yyyy}/${this.previousPosition}`)
        this.previousPosition = undefined;
        this.processing = false;
      },
      async startYear() {
        this.processing = true;
        await useApiFetchPost(`year/${this.nextYearYyyy}`)
        this.processing = false;
      },
      async deleteYear() {
        this.processing = true;
        await useApiFetchDelete(`year/${this.currentYear.yyyy}`)
        this.processing = false;
      },
      async add(songId) {
        this.processing = true;
        const position = this.nextPosition
        const data = {
          songId
        }
        await useApiFetchPost(`list-entry/${this.currentYear.yyyy}/${position}`, data)
        this.previousPosition = position;
        this.nextSongTab = 'existing';
        this.nextSong = undefined;
        this.nextSongFullData = undefined;
        this.spotifyData = undefined;
        this.processing = false;

        this.loadNextFromImport();
      },
      clean(input) {
        return input
            .trim()
            .replace(/[-–(][^-–(]*\b(feat|bonus|edition|expanded|version|remaster|mix|deluxe|edit).*[)]?$/gi, "")
            .trim()
      },
      possibleSong(song) {
        return !song.position(this.currentYear, true) && (this.nextPosition > 100 || !song.markedAsExit());
      }
    }
  })
</script>
