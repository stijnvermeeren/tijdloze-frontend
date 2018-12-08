<template>
    <div>
        <page-title icon="album" icon-alt="Album">
            <h2>{{album.title}}</h2>
        </page-title>

        <table class="info">
            <tbody>
                <tr class="important">
                    <th>Album van</th>
                    <td><tijdloze-artist :artist="album.artist" /></td>
                </tr>
                <tr>
                    <th>Uitgebracht in</th>
                    <td>{{ album.releaseYear }}</td>
                </tr>
                <tr>
                    <th>In de Tijdloze</th>
                    <td>
                        <in-current-list :songs="album.songs" />
                    </td>
                </tr>
                <tr class="unimportant">
                    <th>Externe links</th>
                    <td>
                        <div v-for="(link, index) in links" :key="index">
                            <a :href="link.href">{{ link.title }}</a>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

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
  import Position from '../../components/Position'
  import InCurrentList from '../../components/InCurrentList'

  export default {
    components: {
      InCurrentList,
      Position,
      EntryCount,
      Graph,
      PageTitle
    },
    computed: {
      album() {
        return this.$store.getters['entities/albums']().withAll().with('songs.album').find(this.fullAlbumData.id);
      },
      currentYear() {
        return this.$store.getters.currentYear;
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
