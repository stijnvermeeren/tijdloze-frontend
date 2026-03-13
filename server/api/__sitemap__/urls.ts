import type { SitemapUrlInput } from '#sitemap/types'
import type { CoreDataResponse } from '~/api/contracts'
import { createSlug } from '@/utils/slug'


export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const data = await $fetch<CoreDataResponse>('core-data', {baseURL: config.public.apiUriServer})
  return [
    ...data.artists.map(artist => {
      return {
        loc: `/artiest/${artist.id}-${createSlug(artist.name)}`,
        _sitemap: 'pages',
      }
    }),
    ...data.albums.map(album => {
      return {
        loc: `/album/${album.id}-${createSlug(album.title)}`,
        _sitemap: 'pages',
      }
    }),
    ...data.songs.map(song => {
      return {
        loc: `/nummer/${song.id}-${createSlug(song.title)}`,
        _sitemap: 'pages',
      }
    }),
    ...data.years.map((year: number) => {
      return {
        loc: `/lijst/${year}`,
        _sitemap: 'pages',
      }
    })
  ] satisfies SitemapUrlInput[]
})