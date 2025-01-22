import { defineStore } from 'pinia'
import { useRepo } from 'pinia-orm'
import _ from 'lodash';

import Artist from '~/orm/Artist';
import Song from '~/orm/Song';
import Year from '~/orm/Year';
import List from '~/orm/List';

export const useRootStore = defineStore('root', () => {
  const yearsRaw = ref([])
  const exitSongIds = ref([])
  const commentsOn = ref(true)
  const chatOn = ref(false)
  
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
  const years = computed(() => {
    const years = yearsRaw.value?.map(yyyy => new Year(yyyy)) ?? []
    years.forEach((year, i) => {
      year.previous = years?.[i - 1]
      year.next = years?.[i + 1]
    })
    return years ?? []
  })
  const currentYear = computed(() => {
    return _.last(years.value)
  })
  const previousYear = computed(() => {
    return currentYear.value.previous;
  })

  const usedCountryIds = computed(() => {
    return new Set(useRepo(Artist).all().map(artist => artist.countryId));
  })

  const lastSong = computed(() => {
    const entry = _.first(list(currentYear.value, 1))
    if (entry) {
      return entry.song
    }
  })
  const lastPosition = computed(() => {
    if (lastSong.value) {
      return lastSong.value.position(currentYear.value, true)
    } else {
      return undefined
    }
  })
  const listInProgress = computed(() => {
    return lastPosition.value && lastPosition.value !== 1;
  })
  const lastCompleteYear = computed(() => {
    if (listInProgress.value) {
      return currentYear.value.previous
    } else {
      return currentYear.value
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

  function updateCoreData(json) {
    yearsRaw.value = json.years;
    exitSongIds.value = json.exitSongIds;
  }
  function setExitSongIds(exitSongIds) {
    exitSongIds.value = exitSongIds
  }
  function setCurrentYear(currentYear) {
    if (_.last(yearsRaw.value) !== currentYear) {
      yearsRaw.value = yearsRaw.value.filter(year => year < currentYear)
      yearsRaw.value.push(currentYear)
    }
  }
    
  return {
    artistIdsByName,
    artistIdsByFullName,
    chatOn,
    commentsOn,
    currentYear,
    exitSongIds,
    lastCompleteYear,
    lastPosition,
    lastSong,
    list,
    listInProgress,
    previousYear,
    setExitSongIds,
    setCurrentYear,
    songIdsByTitle,
    songs,
    updateCoreData,
    usedCountryIds,
    years
  }
})
