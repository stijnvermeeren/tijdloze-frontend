<template lang="pug">
  div
    h2 Admin: live updates

    template(v-if='lastSong')
      h3 Vorig nummer
      div
        strong Positie {{lastPosition}} in {{currentYear.yyyy}}:
      div
        | {{ lastSong.artist.fullName }} - {{ lastSong.title }}
        button(@click='undo()', :disabled='processing') Ongedaan maken

    template(v-if='lastPosition === 1 && nextYearYyyy !== currentYear')
      h3 Volgend nummer
      div
        button(@click='startYear()')
          | Jaar {{nextYearYyyy}} starten

    template(v-if='!lastSong || lastPosition > 1')
      h3 Volgend nummer
      div
        strong Positie {{nextPosition}} in {{nextYearYyyy}}
      div
        input#nextType-existing(
          type='radio'
          value='existing'
          v-model='nextSongType'
        )
        label(for='nextType-existing') Nummer dat reeds in de Tijdloze stond
        input#nextType-new(
          type='radio',
          value='new',
          v-model='nextSongType'
        )
        label(for='nextType-new') Nieuw nummer

      .box(v-show="nextSongType === 'existing'")
        search-box(
          placeholder='Zoek nummer...'
          :artist-filter='artist => false'
          :album-filter='album => false'
          :song-filter='possibleSong'
          :songs-year='previousYear'
          @selectSearchResult='selectSearchResult($event)'
        )
        div(v-if='nextSong')
          strong {{nextSong.artist.fullName}} - {{nextSong.title}}
          |  (in {{previousYear.yyyy}} op positie #[position(:year='previousYear', :song='nextSong')])
        div(v-if='nextSongFullData && nextSongFullData.spotifyId')
          spotify(:spotify-id='nextSongFullData.spotifyId')
        div
          button(@click='add(nextSong.id)', :disabled='!nextValid')
            | Toevoegen op positie {{nextPosition}} in {{nextYearYyyy}}

      .box(v-show="nextSongType === 'new'")
        spotify-search(@selectSpotifyTrack='selectSpotifyTrack($event)')
          hr
          new-song-wizard(
            :preset='spotifyData'
            :button-label='`Toevoegen op positie ${nextPosition} in ${nextYearYyyy}`'
            @newSong='add($event.id)'
          )
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
        nextSongType: 'existing',
        nextSong: undefined,
        nextSongFullData: undefined,
        processing: false,
        spotifyData: undefined
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
        return this.lastPosition ? this.lastPosition - 1 : 100;
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
      async selectSearchResult(result) {
        this.nextSong = result.item;
        this.nextSongFullData = undefined;

        this.nextSongFullData = await this.$axios.$get(`song/${this.nextSong.id}`);
      },
      selectSpotifyTrack(track) {
        this.spotifyData = {
          songTitle: track.title,
          artistName: track.artist,
          albumTitle: track.album,
          albumYear: track.year,
          spotifyId: track.spotifyId
        };
      },
      async undo() {
        this.processing = true;
        await this.$axios.$delete(`list-entry/${this.currentYear.yyyy}/${this.lastPosition}`)
        this.$store.dispatch('refreshCurrentList');
        this.processing = false;
      },
      async startYear() {
        this.processing = true;
        await this.$axios.$post(`year/${this.nextYearYyyy}`)
        this.$store.dispatch('refreshCurrentList');
        this.processing = false;
      },
      async add(songId) {
        this.processing = true;
        const data = {
          songId
        }
        await this.$axios.$post(`list-entry/${this.currentYear.yyyy}/${this.nextPosition}`, data)
        this.$store.dispatch('refreshCurrentList');
        this.nextSongType = 'existing';
        this.nextSong = undefined;
        this.nextSongFullData = undefined;
        this.spotifyData = undefined;
        this.processing = false;
      },
      possibleSong(song) {
        return !song.position(this.currentYear) && song.possiblyInList(this.currentYear);
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
</style>
