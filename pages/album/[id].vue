<template lang="pug">
Title {{album.title}} ({{album.artist.name}})
div
  div.flexTitle
    page-title(icon='album' icon-alt='Album')
      h2 {{album.title}}
    ui-admin-link-btn(:to="`/admin/album/${album.id}`") Admin: album aanpassen

  div Album van
    = " "
    strong
      artist-link(:artist='album.artist')
    = " "
    | uit {{ album.releaseYear }}.

  div.links
    ui-external-link-btn(v-for='(link, index) in links' :key='index' :href='link.href') {{ link.title }}

  ui-card(title="In de Tijdloze")
    template(#subtitle)
      entry-count(:songs='album.songs')
    div
      in-current-list(:songs='album.songs')

  ui-card(v-if='top100Songs.length' title="Grafiek")
    d3-graph(:songs='top100Songs')
</template>

<script>
  import { idFromSlug } from '~/utils/slug'
  import Album from "@/orm/Album";
  import {useRootStore} from "~/stores/root";
  import {useRepo} from "pinia-orm";
  import {create404Error} from "~/composables/create404Error";

  export default defineNuxtComponent({
    computed: {
      album() {
        return useRepo(Album)
          .with('artist')
          .with('songs', query => query.with("secondArtist").with("album"))
          .find(this.fullAlbumData.id);
      },
      currentYear() {
        return useRootStore().currentYear;
      },
      top100Songs() {
        return this.album.songsSorted.filter(song => song.listCount(useRootStore().years) > 0)
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
        addLink('urlAllMusic', 'AllMusic');
        return links;
      }
    },
    async asyncData() {
      const {data: fullAlbumData, error} = await useApiFetch(`album/${idFromSlug(useRoute().params.id)}`)
      if (error.value) {
        create404Error()
      }
      return {fullAlbumData};
    }
  })
</script>

<style lang="scss" scoped>
  .links {
    margin-top: 10px;
    margin-bottom: 20px;

    a {
      margin: 0 5px;
    }
  }
</style>
