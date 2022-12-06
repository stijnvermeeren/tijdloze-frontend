<template lang="pug">
  div
    h2 Admin: live updates

    el-card(v-if='previousSong')
      div.header(slot="header")
        div.title Vorig nummer
      div
        strong Positie {{previousPosition}} in {{currentYear.yyyy}}:
      div
        | {{ previousSong.artist.fullName }}
        template(v-if='previousSong.secondArtist')
          |
          | en {{previousSong.secondArtist.fullName}}
        |
        | - {{ previousSong.title }}
        |
        el-button(@click='undo()', :disabled='processing') Ongedaan maken

    el-button(v-if='!lastSong' @click='deleteYear' round type="warning")
      | Jaar {{currentYear.yyyy}} starten ongedaan maken

    el-button(v-if='lastPosition === 1 && nextYearYyyy !== currentYear.yyyy' @click='startYear' round type="primary")
      | Jaar {{nextYearYyyy}} starten

    el-card(v-show='!lastSong || nextPosition > 0')
      div.header(slot="header")
        div.title Volgend nummer
      div
        strong Positie {{nextPosition}} in {{currentYear.yyyy}}

      div.query(v-if="initialQuery")
        | Importeren van "{{initialQuery}}".
        =" "
        a(:href="`https://www.google.com/search?q=${encodeURIComponent(query)}`" target="_blank")
          el-button(size="mini" round icon="el-icon-link") Zoek op Google

      el-radio-group.nextSongTab(v-model="nextSongTab")
        el-radio-button(label="existing") Nummer uit de database
        el-radio-button(label="spotify") Nieuw nummer (via Spotify)
        el-radio-button(label="manual") Nieuw nummer (manueel)

      div(v-show="nextSongTab === 'existing'")
        search-box(
          placeholder='Zoek nummer...'
          :artist-filter='artist => false'
          :album-filter='album => false'
          :song-filter='possibleSong'
          :songs-year='previousYear'
          :initial-query='initialQuery'
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
            el-button(@click='add(nextSong.id)' type="primary" :disabled='!nextValid' round)
              | Toevoegen op positie {{nextPosition}} in {{currentYear.yyyy}}

      div(v-show="nextSongTab === 'spotify'")
        spotify-search(:initialQuery='initialQuery' @selectSpotifyTrack='selectSpotifyTrack($event)')
        div(v-if='spotifyData')
          hr
          new-song-wizard(
            :preset='spotifyData'
            :button-label='`Toevoegen op positie ${nextPosition} in ${currentYear.yyyy}`'
            @newSong='add($event.id)'
          )

      div(v-show="nextSongTab === 'manual'")
        new-song-wizard(
          :button-label='`Toevoegen op positie ${nextPosition} in ${currentYear.yyyy}`'
          @newSong='add($event.id)'
        )

    el-card
      div.header(slot="header")
        div.title Tijdloze {{this.currentYear.yyyy}}: import
        el-button(@click="cancelImport" type="warning" round) Import annuleren
      div(v-if="importSongs.length")
        div In de wachtrij om geïmporteerd te worden...
        div(v-for="{overridePosition, query} in importSongs")
          strong {{overridePosition}}.
          =" "
          span {{query}}
      div(v-else)
        import-form(:startPosition="nextPosition" @startImport="startImport")
</template>

<script>
  import SearchBox from '../../components/SearchBox'
  import Position from '../../components/Position'
  import Spotify from '../../components/Spotify'
  import SpotifySearch from '../../components/admin/SpotifySearch'
  import NewSongWizard from '../../components/admin/NewSongWizard'
  import ImportForm from '../../components/admin/ImportForm'
  import Song from "@/orm/Song";

  export default {
    components: {ImportForm, NewSongWizard, SpotifySearch, Spotify, Position, SearchBox},
    data() {
      return {
        nextSongTab: 'existing',
        nextSong: undefined,
        nextSongFullData: undefined,
        processing: false,
        spotifyData: undefined,
        initialQuery: '',
        importSongs: [],
        overrideNextPosition: undefined,
        previousPosition: undefined
      }
    },
    computed: {
      currentYear() {
        return this.$store.getters.currentYear;
      },
      previousYear() {
        return this.currentYear.previous();
      },
      lastSong() {
        return this.$store.getters.lastSong;
      },
      lastPosition() {
        return this.$store.getters.lastPosition
      },
      nextYearYyyy() {
        return (new Date()).getFullYear();
      },
      nextPosition() {
        if (this.overrideNextPosition) {
          return this.overrideNextPosition;
        } else {
          return this.lastPosition ? this.lastPosition - 1 : 100;
        }
      },
      previousSong() {
        if (this.previousPosition) {
          return Song.query().withAll().all().find(song => song.position(this.currentYear, true) === this.previousPosition)
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
    methods: {
      initialResultCount(value) {
        this.nextSongTab = (value === 0) ? 'spotify' : 'existing';
      },
      loadNextFromImport() {
        let canBeImported = false;
        let nextImport = this.importSongs.shift();
        while (!canBeImported && nextImport) {
          const {overridePosition, query} = nextImport;
          if (!overridePosition || !this.$store.getters.songs.find(song => song.position(this.currentYear, true) === overridePosition)) {
            this.initialQuery = query;
            this.overrideNextPosition = overridePosition;
            canBeImported = true;
          } else {
            nextImport = this.importSongs.shift()
          }
        }
        if (!canBeImported) {
          this.overrideNextPosition = undefined;
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
        this.nextSongFullData = await this.$axios.$get(`song/${this.nextSong.id}`);
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
        await this.$axios.$delete(`list-entry/${this.currentYear.yyyy}/${this.previousPosition}`)
        this.previousPosition = undefined;
        this.processing = false;
      },
      async startYear() {
        this.processing = true;
        await this.$axios.$post(`year/${this.nextYearYyyy}`)
        this.processing = false;
      },
      async deleteYear() {
        this.processing = true;
        await this.$axios.$delete(`year/${this.currentYear.yyyy}`)
        this.processing = false;
      },
      async add(songId) {
        this.processing = true;
        const data = {
          songId
        }
        await this.$axios.$post(`list-entry/${this.currentYear.yyyy}/${this.nextPosition}`, data)
        this.previousPosition = this.nextPosition;
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
            .replace(/[-–(][^-–(]*(bonus|edition|expanded|version|remaster|mix|deluxe|edit).*[)]?$/gi, "")
            .trim()
      },
      possibleSong(song) {
        return !song.position(this.currentYear, true) && (this.nextPosition > 100 || !song.markedAsExit());
      }
    },
    middleware: 'admin',
    head: {
      title: 'Admin: Live'
    }
  }
</script>

<style scoped>
  .el-card {
    overflow: visible;
  }

  .nextSongTab {
    margin-bottom: 20px;
  }

  textarea {
    width: 100%;
  }

  .importStart {
    width: 120px;
  }

  .importStep {
    width: 240px;
  }
</style>
