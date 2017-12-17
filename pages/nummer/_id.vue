<template>
    <div>
        <h2><tijdloze-h2-icon name="song" alt="Nummer" />{{song.title}} (<tijdloze-artist :artist="artist" />)</h2>

        <tijdloze-tabs :tabs="[
          { to: `/nummer/${song.id}`, title: 'Informatie' },
          { to: `/nummer/${song.id}/lyrics`, title: 'Songtekst' }]"
        >
            <nuxt-child :artist="artist" :song="song" :fullSongData="fullSongData" />
        </tijdloze-tabs>
    </div>
</template>

<script>
  import H2Icon from "../../components/H2Icon";
  import _ from 'lodash';

  export default {
    components: {
      TijdlozeH2Icon: H2Icon
    },
    computed: {
      song() {
        return this.$store.getters.songsById[this.fullSongData.id];
      },
      artist() {
        return this.$store.getters.artistsById[this.song.artistId];
      }
    },
    async asyncData({ params, app }) {
      return {
        fullSongData: await app.$axios.$get(`song/${params.id}`)
      };
    },
    head() {
      return {
        title: `${this.song.title} (${this.artist.fullName})`
      }
    }
  }
</script>
