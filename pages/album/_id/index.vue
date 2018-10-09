<template>
    <div>
        <h2><tijdloze-h2-icon name="album" alt="Album" />{{album.title}} (<tijdloze-artist :artist="album.artist" />)</h2>

        <ul class="info">
            <li><strong>Album uit:</strong> {{album.releaseYear}}</li>
            <li v-if="links.length"><strong>Links: </strong>
                <span v-for="(link, index) in links">
                    <span v-if="index > 0">, </span>
                    <a :href="link.href">{{link.title}}</a>
                </span>
            </li>
        </ul>

        <tijdloze-songs-overview-and-graph :songs="album.songs"/>
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
      album() {
        return this.$store.getters['entities/albums']().withAll().with('songs.album').find(this.fullAlbumData.id);
      },
      links() {
        const links = [];
        const addLink = (property, title) => {
          if (this.fullAlbumData[property]) {
            links.push({
              href: this.fullAlbumData[property],
              title: title
            })
          }
        };

        addLink('urlWikiEn', 'Wikipedia (Engels)');
        addLink('urlWikiNl', 'Wikipedia (Nederlands)');
        addLink('urlAllmusic', 'AllMusic');
        return links;
      }
    },
    async asyncData({ params, app }) {
      return {
        fullAlbumData: await app.$axios.$get(`album/${params.id}`)
      };
    },
    head() {
      return {
        title: `${this.album.title} (${this.album.artist.fullName})`
      }
    }
  }
</script>
