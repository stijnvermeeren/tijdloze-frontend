<template lang="pug">
  div
    h2 Admin: live updates

    template(v-if='lastSong')
      h3 Vorig nummer
      div
        strong Positie {{lastPosition}} in {{currentYear.yyyy}}:
      div
        | {{ lastSong.artist.fullName }}
        template(v-if='lastSong.secondArtist')
          |
          | en {{lastSong.secondArtist.fullName}}
        |
        | - {{ lastSong.title }}
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

    template(v-if='!lastSong || lastPosition > 1')
      h3 Volgend nummer
      div
        strong Positie {{nextPosition}} in {{nextYearYyyy}}

      search-box(
        placeholder='Zoek nummer...'
        altOption='Als nieuw nummer toevoegen'
        :artist-filter='artist => false'
        :album-filter='album => false'
        :song-filter='possibleSong'
        :songs-year='previousYear'
        :initial-query='initialGlobalQuery'
        @selectSearchResult='selectSearchResult($event)'
      )

      .box(v-show="nextSongType === 'existing'")
        div(v-if='nextSong')
          strong {{nextSong.artist.fullName}} - {{nextSong.title}}
          |  (in {{previousYear.yyyy}} op positie #[position(:year='previousYear', :song='nextSong')])
        div(v-if='nextSongFullData && nextSongFullData.spotifyId')
          spotify(:spotify-id='nextSongFullData.spotifyId')
        div
          button(@click='add(nextSong.id)', :disabled='!nextValid')
            | Toevoegen op positie {{nextPosition}} in {{nextYearYyyy}}

      .box(v-show="nextSongType === 'new'")
        spotify-search(:initialQuery='initialSpotifyQuery' @selectSpotifyTrack='selectSpotifyTrack($event)')
        hr
        new-song-wizard(
          :preset='spotifyData'
          :button-label='`Toevoegen op positie ${nextPosition} in ${nextYearYyyy}`'
          @newSong='add($event.id)'
        )

    template(v-if="false")
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

  export default {
    components: {NewSongWizard, SpotifySearch, Spotify, Position, SearchBox},
    data() {
      return {
        nextSongType: undefined,
        nextSong: undefined,
        nextSongFullData: undefined,
        processing: false,
        spotifyData: undefined,
        initialSpotifyQuery: '',
        importText: '',
        importSongs: [],
        initialGlobalQuery: '',
        overrideNextPosition: undefined
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
      nextValid() {
        if (this.nextSongType === 'existing') {
          return !!this.nextSong
        } else {
          return true
        }
      }
    },
    methods: {
      loadNextFromImport() {
        let found = false;
        let nextImport = this.importSongs.shift();
        while (!found && nextImport) {
          const {overridePosition, query} = nextImport;
          if (!overridePosition || !this.$store.getters.songs.find(song => song.position(this.currentYear, true) === overridePosition)) {
            this.initialGlobalQuery = query;
            this.overrideNextPosition = overridePosition;
            found = true;
          } else {
            nextImport = this.importSongs.shift()
          }
        }
      },
      startImport() {
        this.importSongs = []
        const fragments = this.importText.split("\n")
        fragments.forEach(fragment => {
          const positionMatch = fragment.match(/^[0-9]+/g);
          let overridePosition = undefined;
          if (positionMatch.length) {
            overridePosition = parseInt(positionMatch[0]);
          }
          const cleanFragment = fragment.replace(/^[0-9 \.]*/g, "").trim()
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
        if (result.type === 'alt') {
          this.nextSongType = 'new';
          this.initialSpotifyQuery = result.query;
        } else {
          this.nextSongType = 'existing';
          this.nextSong = result.item;
          this.nextSongFullData = undefined;

          this.nextSongFullData = await this.$axios.$get(`song/${this.nextSong.id}`);
        }
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
        await this.$axios.$delete(`list-entry/${this.currentYear.yyyy}/${this.lastPosition}`)
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
        this.nextSongType = undefined;
        this.nextSong = undefined;
        this.nextSongFullData = undefined;
        this.spotifyData = undefined;
        this.processing = false;

        this.$store.dispatch('nuxtServerInit');

        if (this.importSongs.length > 0) {
          this.loadNextFromImport();
        }
      },
      clean(input) {
        console.log(input)
        return input
            .trim()
            .replace(/\(with bonus tracks\)$/gi, "")
            .replace(/\(expanded edition\)$/gi, "")
            .replace(/\(deluxe\)$/gi, "")
            .replace(/\((super )?deluxe( edition)?\)$/gi, "")
            .replace(/[-–] .* version$/gi, "")
            .replace(/[-–] [0-9 ]*remaster(ed)?[0-9 ]*$/gi, "")
            .replace(/[-–] mono mix$/gi, "")
            .replace(/\([0-9 ]*remaster(ed)?[0-9 ]*\)$/gi, "")
            .trim()
      },
      possibleSong(song) {
        return !song.position(this.currentYear, true) && !song.markedAsExit();
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
