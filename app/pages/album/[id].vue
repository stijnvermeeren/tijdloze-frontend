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
    nuxt-page(keepalive :album="album" :songs="songs")
</template>

<script setup lang="ts">
  import { idFromSlug } from '~/utils/slug'
  import Album from "~/orm/Album";
  import {useRepo} from "pinia-orm";

  const routeId = useRouteParam('id') || ''
  const albumId = computed(() => idFromSlug(routeId))

  const {currentYear, years} = storeToRefs(useYearStore())

  const album = computed<Album>(() => {
    const foundAlbum = useRepo(Album)
      .with('artist')
      .with('songs', query => query.with("artist").with("secondArtist").with("album"))
      .find(albumId.value)

    if (!foundAlbum) {
      throw createError({ statusCode: 404, statusMessage: 'Pagina niet gevonden' })
    }

    return foundAlbum
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

<style scoped>
</style>
