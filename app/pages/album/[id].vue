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
    nuxt-page(:album="album" :songs="songs" :full-album-data="fullAlbumData")
</template>

<script setup>
  import { idFromSlug } from '~/utils/slug'
  import Album from "~/orm/Album";
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

  const songs = computed(() => {
    return album.value.songsSorted
  })

  const tabs = computed(() => {
    const prefix = `/album/${albumId.value}-${album.value.slug}`
    return [
      { to: prefix, title: `Nummers in de Tijdloze` },
      { to: `${prefix}/grafiek`, title: 'Op grafiek' },
      { to: `${prefix}/info`, title: 'Info' }
    ]
  })

  definePageMeta({
    noScrollDepth: 2
  })
</script>

<style lang="scss" scoped>
</style>
