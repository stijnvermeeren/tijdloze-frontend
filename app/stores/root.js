import { defineStore } from 'pinia'
import { useRepo } from 'pinia-orm'
import _ from 'lodash';

import Artist from '~/orm/Artist';
import Song from '~/orm/Song';
import List from '~/orm/List';
import {useYearStore} from "~/stores/year";

export const useRootStore = defineStore('root', () => {
  const yearStore = useYearStore()

  const exitSongIds = ref([])
  
  const songIdsByTitle = computed(() => {
    return _.mapValues(
      _.groupBy(useRepo(Song).all(), song => song.title.toLowerCase()),
      songs => songs.map(song => song.id)
    )
  })
  const artistIdsByFullName = computed(() => {
    return _.mapValues(
      _.groupBy(useRepo(Artist).all(), artist => artist.name.toLowerCase()),
      artists => artists.map(artist => artist.id)
    )
  })
  const artistIdsByName = computed(() => {
    return _.mapValues(
      _.groupBy(useRepo(Artist).all(), artist => artist.name.toLowerCase()),
      artists => artists.map(artist => artist.id)
    )
  })
  const songs = computed(() => {
    return _.sortBy(
      useRepo(Song).withAll().get(),
      song => [song.title, song.album.releaseYear]
    );
  })

  const usedCountryIds = computed(() => {
    return new Set(useRepo(Artist).all().map(artist => artist.countryId));
  })

  const lastSong = computed(() => {
    const entry = _.first(list(yearStore.currentYear, 1))
    if (entry) {
      return entry.song
    }
  })
  const lastPosition = computed(() => {
    if (lastSong.value) {
      return lastSong.value.position(yearStore.currentYear, true)
    } else {
      return undefined
    }
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

  function list(year, limit, maxPosition) {
    const list = useRepo(List).find(year?.yyyy)
    if (list) {
      let notNullSongIds = list.songIds.filter(x => x)
      if (limit > 0) {
        notNullSongIds = _.take(notNullSongIds, limit)
      }
      const songs = useRepo(Song).with('album').with('artist').with('album').with('artist').find(notNullSongIds)
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
          if (position in list.attributions) {
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
    artistIdsByName,
    artistIdsByFullName,
    exitSongIds,
    lastCompleteYear,
    lastPosition,
    lastSong,
    list,
    listInProgress,
    songIdsByTitle,
    songs,
    usedCountryIds
  }
})
