<template>
    <div>
        <h2><tijdloze-h2-icon name="artist" alt="Artiest" />{{artist.fullName}}</h2>

        <tijdloze-tabs :tabs="[
          { to: `/artiest/${artist.id}`, title: 'Informatie en nummers' },
          { to: `/artiest/${artist.id}/albums`, title: 'Albums' }
        ]">
            <nuxt-child :artist="artist" :fullArtistData="fullArtistData" />
        </tijdloze-tabs>
    </div>
</template>

<script>
  import H2Icon from "../../components/H2Icon";

  export default {
    components: {
      TijdlozeH2Icon: H2Icon
    },
    computed: {
      artist() {
        return this.$store.getters.artistsById[this.fullArtistData.id];
      }
    },
    async asyncData({ params, app }) {
      return {
        fullArtistData: await app.$axios.$get(`artist/${params.id}`)
      };
    },
    head() {
      return {
        title: this.artist.fullName
      }
    }
  }
</script>
