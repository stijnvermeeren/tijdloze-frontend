<template lang="pug">
  div
    h2 Admin: live updates

    template(v-if='previousSong')
      h3 Vorig nummer
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
        button(@click='undo()', :disabled='processing') Ongedaan maken

    template(v-if='!lastSong')
      h3 Jaar {{currentYear.yyyy}} gestart
      div
        button(@click='deleteYear()')
          | Jaar starten ongedaan maken

    template(v-if='lastPosition === 1 && nextYearYyyy !== currentYear.yyyy')
      h3 Volgend nummer
      div
        button(@click='startYear()')
          | Jaar {{nextYearYyyy}} starten

    div(v-show='!lastSong || nextPosition > 0')
      h3 Volgend nummer
      div
        strong Positie {{nextPosition}} in {{currentYear.yyyy}}

      div(v-show="!nextSongNew")
        h4
          | Bestaand nummer of
          |
          a(@click="nextSongNew = true") nieuw nummer
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

        .box(v-if="nextSong")
          div
            strong {{nextSong.artist.fullName}} - {{nextSong.title}}
            |  (in {{previousYear.yyyy}} op positie #[position(:year='previousYear', :song='nextSong')])
          div(v-if='nextSongFullData && nextSongFullData.spotifyId')
            spotify(:spotify-id='nextSongFullData.spotifyId')
          div
            button(@click='add(nextSong.id)', :disabled='!nextValid')
              | Toevoegen op positie {{nextPosition}} in {{currentYear.yyyy}}

      div(v-show="nextSongNew")
        h4
          a(@click="nextSongNew=false") Bestaand nummer
          |
          | of nieuw nummer
        .box
          spotify-search(:initialQuery='initialQuery' @selectSpotifyTrack='selectSpotifyTrack($event)')
          hr
          new-song-wizard(
            :preset='spotifyData'
            :button-label='`Toevoegen op positie ${nextPosition} in ${currentYear.yyyy}`'
            @newSong='add($event.id)'
          )

    template
      h3 Import
      textarea(v-model="importText" rows="10")
      div
        button(@click="startImport") Import beginnen
</template>

<script>
  import SearchBox from '../../components/SearchBox'
  import Position from '../../components/Position'
  import Spotify from '../../components/Spotify'
  import SpotifySearch from '../../components/admin/SpotifySearch'
  import NewSongWizard from '../../components/admin/NewSongWizard'
  import Song from "@/orm/Song";

  export default {
    components: {NewSongWizard, SpotifySearch, Spotify, Position, SearchBox},
    data() {
      return {
        nextSongNew: false,
        nextSong: undefined,
        nextSongFullData: undefined,
        processing: false,
        spotifyData: undefined,
        initialQuery: '',
        importText: '',
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
        if (this.nextSongNew) {
          return !!this.nextSong
        } else {
          return true
        }
      }
    },
    methods: {
      initialResultCount(value) {
        this.nextSongNew = value === 0;
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
      startImport() {
        this.importSongs = []
        const fragments = this.importText.split("\n")
        fragments.forEach(fragment => {
          const positionMatch = fragment.match(/^[0-9]+/g);
          let overridePosition = undefined;
          if (positionMatch && positionMatch.length) {
            overridePosition = parseInt(positionMatch[0]);
          }
          const cleanFragment = fragment.replace(/^[0-9]*[ \.]+/g, "").trim()
          if (cleanFragment) {
            this.importSongs.push({
              overridePosition: overridePosition,
              query: cleanFragment
            })
          }
        })
        this.loadNextFromImport();
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
        this.nextSongNew = false;
        this.nextSong = undefined;
        this.nextSongFullData = undefined;
        this.spotifyData = undefined;
        this.processing = false;

        this.loadNextFromImport();
      },
      clean(input) {
        return input
            .trim()
            .replace(/[-–(].*(bonus|edition|expanded|version|remaster|mix).*[)]?$/gi, "")
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
  div.box {
    border: 1px solid grey;
    padding: 5px 10px;
    margin: 10px 0;
  }

  textarea {
    width: 100%;
  }
</style>
