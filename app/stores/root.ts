import { defineStore } from 'pinia'
import { useRepo } from 'pinia-orm'
import { sortWith, ascend } from 'ramda'

import Artist from '~/orm/Artist';
import Song from '~/orm/Song';
import List from '~/orm/List';
import type Year from '~/orm/Year';
import {useYearStore} from "~/stores/year";

type ListEntry = {
  position: number
  song: Song
  attribution: string | undefined
}

export const useRootStore = defineStore('root', () => {
  const yearStore = useYearStore()

  const exitSongIds = ref<number[]>([])
  const coreDataId = ref<number | null>(null)
  
  function indexByProperty<T extends { id: number }>(data: T[], selector: (entry: T) => string): Record<string, number[]> {
    const grouped = Object.groupBy(data, selector)
    return Object.fromEntries(
      Object.entries(grouped).map(([key, entries]) => [key, (entries ?? []).map(entry => entry.id)])
    )
  }

  const songIdsByTitle = computed<Record<string, number[]>>(() => {
    return indexByProperty(useRepo(Song).all() as Song[], song => song.title.toLowerCase())
  })
  const artistIdsByFullName = computed<Record<string, number[]>>(() => {
    return indexByProperty(useRepo(Artist).all() as Artist[], artist => artist.name.toLowerCase())
  })
  const artistIdsByName = computed<Record<string, number[]>>(() => {
    return indexByProperty(useRepo(Artist).all() as Artist[], artist => artist.name.toLowerCase())
  })
  const songs = computed<Song[]>(() => {
    return sortWith([
      ascend((song: Song) => song.title),
      ascend((song: Song) => song.album.releaseYear)
    ], useRepo(Song).withAll().get() as Song[])
  })

  const usedCountryIds = computed<Set<string | null>>(() => {
    return new Set((useRepo(Artist).all() as Artist[]).map(artist => artist.countryId))
  })

  const lastSong = computed<Song | undefined>(() => {
    return list(yearStore.currentYear, 1)?.[0]?.song
  })
  const lastPosition = computed<number>(() => {
    if (!lastSong.value || !yearStore.currentYear) {
      return 0
    }
    return lastSong.value.position(yearStore.currentYear, true) ?? 0
  })
  const listInProgress = computed<boolean>(() => {
    return lastPosition.value !== 0 && lastPosition.value !== 1
  })
  const lastCompleteYear = computed<Year | undefined>(() => {
    if (listInProgress.value) {
      return yearStore.previousYear
    } else {
      return yearStore.currentYear
    }
  })

  const maxPositionByYyyy = computed<Record<number, number>>(() => {
    const result: Record<number, number> = {}
    ;(useRepo(List).all() as List[]).forEach(listEntry => {
      result[listEntry.year] = listEntry.songIds.length
    })
    return result
  })

  function list(year?: Year, limit?: number, maxPosition?: number): ListEntry[] {
    if (!year) {
      return []
    }

    const yearList = useRepo(List).find(year.yyyy) as List | null
    if (yearList) {
      let notNullSongIds = yearList.songIds.filter((x): x is number => x !== null)
      if ((limit ?? 0) > 0) {
        notNullSongIds = notNullSongIds.slice(0, limit)
      }
      const songs = useRepo(Song).with('album').with('artist').with('secondArtist').find(notNullSongIds) as Song[]
      const songsById: Record<number, Song> = {}
      songs.forEach(song => {
        songsById[song.id] = song
      })
      const entries: ListEntry[] = []
      for (const [index, songId] of yearList.songIds.entries()) {
        const position = index + 1
        if ((maxPosition ?? 0) > 0 && position > (maxPosition ?? 0)) {
          return entries
        }
        if (songId && songsById[songId]) {
          let attribution: string | undefined
          if (yearList.attributions && position in yearList.attributions) {
            attribution = yearList.attributions[position]
          }
          entries.push({
            position,
            song: songsById[songId],
            attribution
          })
        }
        if ((limit ?? 0) > 0 && entries.length >= (limit ?? 0)) {
          return entries
        }
      }
      return entries
    } else {
      return []
    }
  }
    
  return {
    coreDataId,
    artistIdsByName,
    artistIdsByFullName,
    exitSongIds,
    lastCompleteYear,
    lastPosition,
    lastSong,
    list,
    listInProgress,
    maxPositionByYyyy,
    songIdsByTitle,
    songs,
    usedCountryIds
  }
})
