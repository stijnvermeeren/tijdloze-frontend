<template lang="pug">
Title {{album.title}} ({{album.artist.fullName}})
div
  div.flexTitle
    page-title(icon='album' icon-alt='Album')
      h2 {{album.title}}
    div(v-if="isAdmin")
      nuxt-link(:to="`/admin/album/${album.id}`")
        el-button(type="warning" round size="small") Admin: album aanpassen

  div Album van
    = " "
    strong
      artist-link(:artist='album.artist')
    = " "
    | uit {{ album.releaseYear }}.

  div.links
    a(v-for='(link, index) in links' :key='index' :href='link.href')
      el-button(size="small" round)
        el-icon
          el-icon-link
        span {{ link.title }}

  el-card
    template(#header)
      div.header(slot="header")
        div
          div.title In de Tijdloze
          div.subtitle
            entry-count(:songs='album.songs')
        div
          el-radio-group(v-model="tab" size="small")
            el-radio-button(label='tijdloze') Tijdloze {{currentYear.yyyy}}
            el-radio-button(label='all') Alle Tijdloze nummers
    div(v-if="tab === 'tijdloze'")
      in-current-list(:songs='album.songs')
    div(v-if="tab === 'all'")
      ul(v-if='album.songsSorted')
        li(v-for='song in album.songsSorted')
          song-with-second-artist-link(:song='song')

  el-card(v-if='top100Songs.length')
    template(#header)
      div.header(slot="header")
        div
          div.title Grafiek
    d3-graph(:songs='top100Songs')
</template>

<script>
  import { idFromSlug } from '~/utils/slug'
  import Album from "@/orm/Album";
  import {useRootStore} from "~/stores/root";
  import {useAuthStore} from "~/stores/auth";
  import {useRepo} from "pinia-orm";

  export default defineNuxtComponent({
    data() {
      return {
        tab: 'tijdloze'
      }
    },
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
      },
      isAdmin() {
        return useAuthStore().isAdmin;
      }
    },
    async asyncData() {
      const {data: fullAlbumData} = await useApiFetch(`album/${idFromSlug(useRoute().params.id)}`)
      return {fullAlbumData};
    }
  })
</script>

<style lang="scss" scoped>
  .links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;

    a {
      margin: 0 5px;
    }
  }

  .el-radio-group {
    text-align: right;
  }
</style>
