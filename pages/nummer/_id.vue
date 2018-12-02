<template>
    <div class="container">
        <h2><tijdloze-h2-icon name="song" alt="Nummer" />{{song.title}} (<tijdloze-artist :artist="song.artist" />)</h2>

        <div v-if="fullSongData.spotifyId" class="spotify">
            <iframe :src="`https://open.spotify.com/embed/track/${fullSongData.spotifyId}`" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        </div>

        <tijdloze-tabs :tabs="[
          { to: `/nummer/${song.id}`, title: 'Informatie' },
          { to: `/nummer/${song.id}/lyrics`, title: 'Songtekst' }]"
        >
            <nuxt-child :song="song" :fullSongData="fullSongData" />
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
        return this.$store.getters['entities/songs']().withAll().find(this.fullSongData.id);
      }
    },
    async asyncData({ params, app }) {
      return {
        fullSongData: await app.$axios.$get(`song/${params.id}`)
      };
    },
    head() {
      return {
        title: `${this.song.title} (${this.song.artist.fullName})`
      }
    }
  }
</script>

<style lang="less" scoped>
    div.container {
        position: relative;
    }
    div.spotify {
        position: absolute;
        top: 0;
        right: 0;
    }
</style>
