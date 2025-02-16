<template lang="pug">
Title {{artist.name}}
div
  div.flexTitle
    page-title(icon='artist' icon-alt='Artiest')
      h2 {{artist.name}}
    ui-admin-link-btn(:to="`/admin/artist/${artist.id}`") Admin: artist aanpassen

  ui-tabs(:tabs="tabs")
    nuxt-page(:artist="artist" :top100-songs="top100Songs" :full-artist-data="fullArtistData")
</template>

<script setup>
  import { idFromSlug } from '~/utils/slug'
  import Artist from "@/orm/Artist";
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

  const top100Songs = computed(() => {
    return artist.value.allSongs.filter(song => song.listCount(years.value) > 0)
  })

  const links = computed(() => {
    const links = [];
    const addLink = (property, title, fn) => {
      if (!fn) {
        fn = x => x
      }

      if (fullArtistData.value[property]) {
        links.push({
          href: fn(fullArtistData.value[property]),
          title: title
        })
      }
    };

    addLink('urlOfficial', 'Officiële website');
    addLink('urlWikiEn', 'Wikipedia (Engels)');
    addLink('urlWikiNl', 'Wikipedia (Nederlands)');
    addLink('urlAllMusic', 'AllMusic');
    addLink('spotifyId', 'Spotify', id => `https://open.spotify.com/artist/${id}`);
    return links;
  })

  const tabs = computed(() => {
    const tabs = [{ to: `/artiest/${artistId.value}`, title: `In de Tijdloze van ${currentYear.value.yyyy}` }]
    if (top100Songs.value.length) {
      tabs.push({ to: `/artiest/${artistId.value}/grafiek`, title: 'Op grafiek', subtitle: "top 100" })
    }
    tabs.push({ to: `/artiest/${artistId.value}/info`, title: 'Info' })
    return tabs
  })

  definePageMeta({
    noScrollDepth: 2
  })
</script>

<style lang="scss" scoped>
</style>
