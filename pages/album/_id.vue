<template>
    <div>
        <page-title icon="album" icon-alt="Album">
            <h2>{{album.title}}</h2>
            <div class="subtitle">
                <div>Album van <strong><tijdloze-artist :artist="album.artist" /></strong></div>
                <div>Uitgebracht in {{ album.releaseYear }}</div>
            </div>
        </page-title>

        <ul class="info">
            <li v-if="links.length"><strong>Links: </strong>
                <span v-for="(link, index) in links">
                    <span v-if="index > 0">, </span>
                    <a :href="link.href">{{link.title}}</a>
                </span>
            </li>
        </ul>

        <h3>In de Tijdloze</h3>

        <div><entry-count :songs="album.songs" /></div>

        <graph
          v-if="album.songs.find(song => song.listCount($store.getters.years) > 0)"
          :songs="album.songs"
        />
    </div>
</template>

<script>
  import PageTitle from '~/components/PageTitle'
  import Graph from '../../components/d3/Graph'
  import EntryCount from '../../components/EntryCount'

  export default {
    components: {
      EntryCount,
      Graph,
      PageTitle
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

<style lang="less" scoped>
    div.subtitle {
        font-size: 16px;
        margin: -4px 0 0 0;
    }
</style>
