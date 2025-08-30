<template lang="pug">
Title {{artist.name}}
div
  div.flexTitle
    page-title(icon='artist' icon-alt='Artiest')
      h2 {{artist.name}}
    ui-admin-link-btn(:to="`/admin/artist/${artist.id}`") Admin: artist aanpassen

  ui-tabs(:tabs="tabs")
    nuxt-page(:artist="artist" :songs="songs" :full-artist-data="fullArtistData")
</template>

<script setup>
  import { idFromSlug } from '~/utils/slug'
  import Artist from "~/orm/Artist";
  import {useRepo} from "pinia-orm";

  const {currentYear, years} = storeToRefs(useYearStore())

  const artistId = computed(() => idFromSlug(useRoute().params?.id))

  // TODO: https://github.com/nuxt/nuxt/issues/20664#issuecomment-2453845270
  const {data: fullArtistData, error} = await useFetch(
      `artist/${artistId.value}`, useFetchOpts({key: `artist/${artistId.value}`})
  )

  if (error.value) {
    create404Error()
  }

  const artist = computed(() => {
    return useRepo(Artist)
        .with('albums', q1 => q1
            .with('songs', q2 => q2
                .with('secondArtist').with('artist').with('album')))
        .with('songs', q1 => q1
            .with('album')
            .with('artist')
            .with('secondArtist'))
        .with('secondarySongs', q1 => q1
            .with('artist')
            .with('secondArtist')
            .with('album', q2 => q2
                .with('songs', q3 => q3
                    .with('artist').with('secondArtist').with('album'))))
        .find(artistId.value);
  })

  const songs = computed(() => {
    return artist.value.allSongs
  })

  const tabs = computed(() => {
    const prefix = `/artiest/${artistId.value}-${artist.value.slug}`
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
