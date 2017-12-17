<template>
    <div>
        <h2><tijdloze-h2-icon name="artist" alt="Artiest" />{{artist.fullName}}</h2>

        <tijdloze-tabs :tabs="[{ title: 'Informatie en nummers' }, { to: `/artiest/${artist.id}/albums`, title: 'Albums' }]">
            <ul class="info">
                <li><tijdloze-country-icon :country="country" /> {{country.name}}</li>
                <li v-if="links.length"><strong>Links: </strong>
                    <span v-for="(link, index) in links">
                        <span v-if="index > 0">, </span>
                        <a :href="link.href">{{link.title}}</a>
                    </span>
                </li>
                <li v-if="fullArtistData.notes"><em>{{fullArtistData.notes}}</em></li>
            </ul>

            <tijdloze-songs-overview-and-graph :songs="songs"/>
        </tijdloze-tabs>
    </div>
</template>

<script>
  import SongsOverviewAndGraph from "../../../components/SongsOverviewAndGraph";
  import H2Icon from "../../../components/H2Icon";

  export default {
    components: {
      TijdlozeSongsOverviewAndGraph: SongsOverviewAndGraph,
      TijdlozeH2Icon: H2Icon
    },
    computed: {
      artist() {
        return this.$store.getters.artistsById[this.fullArtistData.id];
      },
      country() {
        return this.$store.getters.countriesById[this.artist.countryId];
      },
      songs() {
        return this.$store.getters.songsByArtistId(this.artist.id);
      },
      links() {
        const links = [];
        const addLink = (property, title) => {
          if (this.fullArtistData[property]) {
            links.push({
              href: this.fullArtistData[property],
              title: title
            })
          }
        };

        addLink('urlOfficial', 'Officiële website');
        addLink('urlWikiEn', 'Wikipedia (Engels)');
        addLink('urlWikiNl', 'Wikipedia (Nederlands)');
        addLink('urlAllmusic', 'AllMusic');
        return links;
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
