<template lang="pug">
Title {{album.title}} ({{album.artist.name}})
div
  div.flexTitle
    page-title(icon='album' icon-alt='Album')
      h2
        album-title(:album="album")
    ui-admin-link-btn(:to="`/admin/album/${album.id}`") Admin: album aanpassen

  div Album van
    = " "
    strong
      artist-link(:artist='album.artist')
    = " "
    | uit {{ album.releaseYear }}.

  ui-tabs(:tabs="tabs")
    nuxt-page(:album="album" :top100-songs="top100Songs" :full-album-data="fullAlbumData")
</template>

<script setup>
  import { idFromSlug } from '~/utils/slug'
  import Album from "@/orm/Album";
  import {useRepo} from "pinia-orm";

  const albumId = computed(() => idFromSlug(useRoute().params?.id))

  const {currentYear, years} = storeToRefs(useYearStore())

  const {data: fullAlbumData, error} = await useFetch(
      `album/${albumId.value}`, useFetchOpts({'key': `album/${albumId.value}`})
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

  const top100Songs = computed(() => {
    return album.value.songsSorted.filter(song => song.listCount(years.value) > 0)
  })

  const tabs = computed(() => {
    const tabs = [{ to: `/album/${albumId.value}`, title: `In de Tijdloze van ${currentYear.value.yyyy}` }]
    if (top100Songs.value.length) {
      tabs.push({ to: `/album/${albumId.value}/grafiek`, title: 'Op grafiek', subtitle: "top 100" })
    }
    tabs.push({ to: `/album/${albumId.value}/info`, title: 'Info' })
    return tabs
  })

  definePageMeta({
    noScrollDepth: 2
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
