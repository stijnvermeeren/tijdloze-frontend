import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'
import { createSlug } from '@/utils/slug.js'


export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const data: any = await $fetch('core-data', {baseURL: config.public.apiUriServer})
  return [
    ...data.artists.map((artist: any) => {
      return {
        loc: `/artiest/${artist.id}-${createSlug(artist.name)}`,
        _sitemap: 'pages',
      }
    }),
    ...data.albums.map((album: any) => {
      return {
        loc: `/album/${album.id}-${createSlug(album.title)}`,
        _sitemap: 'pages',
      }
    }),
    ...data.songs.map((song: any) => {
      return {
        loc: `/nummer/${song.id}-${createSlug(song.title)}`,
        _sitemap: 'pages',
      }
    }),
    ...data.years.map((year: Number) => {
      return {
        loc: `/lijst/${year}`,
        _sitemap: 'pages',
      }
    })
  ] satisfies SitemapUrlInput[]
})