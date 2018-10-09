<template>
    <div>
        <ul class="info">
            <li><tijdloze-country-icon :country="country" /> {{country.name}}</li>
            <li v-if="links.length"><strong>Links: </strong>
                <span v-for="(link, index) in links">
                    <span v-if="index > 0">, </span>
                    <a :href="link.href">{{link.title}}</a>
                </span>
            </li>
            <li v-if="fullArtistData.notes"><em><tijdloze-links :text="fullArtistData.notes" /></em></li>
        </ul>

        <tijdloze-songs-overview-and-graph :songs="artist.songs"/>
    </div>
</template>

<script>
  import SongsOverviewAndGraph from "../../../components/SongsOverviewAndGraph";

  export default {
    components: {
      TijdlozeSongsOverviewAndGraph: SongsOverviewAndGraph
    },
    props: ['artist', 'fullArtistData'],
    computed: {
      country() {
        return this.$store.getters.countriesById[this.artist.countryId];
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
    }
  }
</script>
