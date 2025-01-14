import { defineStore } from 'pinia'
import { useRepo } from 'pinia-orm'
import _ from 'lodash';

import Artist from '~/orm/Artist';
import Song from '~/orm/Song';
import Year from '~/orm/Year';
import List from '~/orm/List';

export const useRootStore = defineStore('root', {
  state: () => ({
    yearsRaw: [],
    exitSongIds: [],
    commentsOn: true,
    chatOn: false
  }),
  getters: {
    songIdsByTitle(state) {
      return _.mapValues(
        _.groupBy(useRepo(Song).all(), song => song.title.toLowerCase()),
        songs => songs.map(song => song.id)
      )
    },
    artistIdsByFullName(state) {
      return _.mapValues(
        _.groupBy(useRepo(Artist).all(), artist => artist.name.toLowerCase()),
        artists => artists.map(artist => artist.id)
      )
    },
    artistIdsByName(state) {
      return _.mapValues(
        _.groupBy(useRepo(Artist).all(), artist => artist.name.toLowerCase()),
        artists => artists.map(artist => artist.id)
      )
    },
    songs(state) {
      return _.sortBy(
        useRepo(Song).withAll().get(),
        song => [song.title, song.album.releaseYear]
      );
    },
    years(state) {
      const years = state.yearsRaw?.map(yyyy => new Year(yyyy)) ?? []
      years.forEach((year, i) => {
        year.previous = years?.[i - 1]
        year.next = years?.[i + 1]
      })
      return years ?? []
    },
    currentYear(state) {
      return _.last(this.years)
    },
    usedCountryIds(state) {
      return new Set(useRepo(Artist).all().map(artist => artist.countryId));
    },
    list(state) {
      return (year, limit, maxPosition) => {
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
    },
    lastSong(state) {
      const entry = _.first(useRootStore().list(this.currentYear, 1))
      if (entry) {
        return entry.song
      }
    },
    lastPosition(state) {
      const lastSong = this.lastSong
      if (lastSong) {
        return lastSong.position(this.currentYear, true)
      } else {
        return undefined
      }
    },
    listInProgress(state) {
      return this.lastPosition && this.lastPosition !== 1;
    },
    lastCompleteYear(state) {
      if (this.listInProgress) {
        return this.currentYear.previous
      } else {
        return this.currentYear
      }
    }
  },
  actions: {
    setCommentsOn(commentsOn) {
      this.commentsOn = commentsOn
    },
    setChatOn(chatOn) {
      this.chatOn = chatOn
    },
    updateCoreData(json) {
      this.yearsRaw = json.years;
      this.exitSongIds = json.exitSongIds;
    },
    setExitSongIds(exitSongIds) {
      this.exitSongIds = exitSongIds
    },
    setCurrentYear(currentYear) {
      if (_.last(this.yearsRaw) !== currentYear) {
        this.yearsRaw = this.yearsRaw.filter(year => year < currentYear)
        this.yearsRaw.push(currentYear)
      }
    }
  }
})
