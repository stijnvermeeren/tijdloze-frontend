import { defineStore } from 'pinia'
import { useRepo } from 'pinia-orm'
import { sortWith, ascend } from 'ramda'

import Artist from '~/orm/Artist';
import Song from '~/orm/Song';
import List from '~/orm/List';
import {useYearStore} from "~/stores/year";

export const useRootStore = defineStore('root', () => {
  const yearStore = useYearStore()

  const exitSongIds = ref([])
  const coreDataId = ref(null)
  
  function indexByProperty(data, selector) {
    const grouped = Object.groupBy(data, selector)
    return Object.fromEntries(
      Object.entries(grouped).map(([key, entries]) => [key, entries.map(entry => entry.id)])
    )
  }

  const songIdsByTitle = computed(() => {
    return indexByProperty(useRepo(Song).all(), song => song.title.toLowerCase())
  })
  const artistIdsByFullName = computed(() => {
    return indexByProperty(useRepo(Artist).all(), artist => artist.name.toLowerCase())
  })
  const artistIdsByName = computed(() => {
    return indexByProperty(useRepo(Artist).all(), artist => artist.name.toLowerCase())
  })
  const songs = computed(() => {
    return sortWith([
      ascend(song => song.title),
      ascend(song => song.album.releaseYear)
    ])(useRepo(Song).withAll().get());
  })

  const usedCountryIds = computed(() => {
    return new Set(useRepo(Artist).all().map(artist => artist.countryId));
  })

  const lastSong = computed(() => {
    return list(yearStore.currentYear, 1)?.[0]?.song
  })
  const lastPosition = computed(() => {
    return lastSong.value?.position(yearStore.currentYear, true)
  })
  const listInProgress = computed(() => {
    return lastPosition.value && lastPosition.value !== 1;
  })
  const lastCompleteYear = computed(() => {
    if (listInProgress.value) {
      return yearStore.previousYear
    } else {
      return yearStore.currentYear
    }
  })

  const maxPositionByYyyy = computed(() => {
    const result = {}
    useRepo(List).all().forEach(list => {
      result[list.year] = list.songIds.length
    })
    return result
  })

  function list(year, limit, maxPosition) {
    const list = useRepo(List).find(year?.yyyy)
    if (list) {
      let notNullSongIds = list.songIds.filter(x => x)
      if (limit > 0) {
        notNullSongIds = notNullSongIds.slice(0, limit)
      }
      const songs = useRepo(Song).with('album').with('artist').with('secondArtist').find(notNullSongIds)
      const songsById = {}
      songs.forEach(song => {
        songsById[song.id] = song
      })
      const entries = []
      for (const [index, songId] of list.songIds.entries()) {
        const position = index + 1
        if (maxPosition > 0 && position > maxPosition) {
          return entries
        }
        if (songId && songsById[songId]) {
          let attribution = undefined
          if (list.attributions && position in list.attributions) {
            attribution = list.attributions[position]
          }
          entries.push({
            position,
            song: songsById[songId],
            attribution
          })
        }
        if (limit > 0 && entries.length >= limit) {
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
