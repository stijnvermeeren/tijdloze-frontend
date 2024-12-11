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

<script setup>
  import { idFromSlug } from '~/utils/slug'
  import Album from "@/orm/Album";
  import {useRootStore} from "~/stores/root";
  import {useRepo} from "pinia-orm";

  const albumId = computed(() => idFromSlug(useRoute().params?.id))

  const {data: fullAlbumData, error} = await useFetch(
      `album/${albumId.value}`, useFetchOpts()
  )
  if (error.value) {
    create404Error()
  }

  const album = computed(() => {
    return useRepo(Album)
      .with('artist')
      .with('songs', query => query.with("artist").with("secondArtist").with("album"))
      .find(albumId.value);
  })

  const currentYear = computed(() => {
    return useRootStore().currentYear;
  })

  const top100Songs = computed(() => {
    return album.value.songsSorted.filter(song => song.listCount(useRootStore().years) > 0)
  })

  const links = computed(() => {
    const links = [];
    const addLink = (property, title) => {
      if (fullAlbumData.value[property]) {
        links.push({
          href: fullAlbumData.value[property],
          title: title
        })
      }
    };

    addLink('urlWikiEn', 'Wikipedia (Engels)');
    addLink('urlWikiNl', 'Wikipedia (Nederlands)');
    addLink('urlAllMusic', 'AllMusic');
    return links;
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
