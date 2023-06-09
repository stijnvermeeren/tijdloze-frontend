import { defineStore, createPinia } from 'pinia'
import {createORM, useRepo} from 'pinia-orm'
import _ from 'lodash';

import Artist from '~/orm/Artist';
import Song from '~/orm/Song';
import Year from '~/orm/Year';
import List from '~/orm/List';

const pinia = createPinia().use(createORM())

export const useRootStore = defineStore('root', {
  state: () => ({
    yearsRaw: [],
    exitSongIds: [],
    songIdsByTitle: {},
    artistIdsByName: {},
    artistIdsByFullName: {},
    commentsOn: true,
    chatOn: false
  }),
  getters: {
    songs(state) {
      return _.sortBy(
        useRepo(Song).withAll().get(),
        song => [song.title, song.album.releaseYear]
      );
    },
    years(state) {
      return state.yearsRaw?.map(yyyy => new Year(yyyy, state.yearsRaw)) ?? []
    },
    year(state) {
      return (yyyy) => new Year(yyyy, state.yearsRaw)
    },
    currentYear(state) {
      return _.last(this.years)
    },
    usedCountryIds(state) {
      return new Set(useRepo(Artist).all().map(artist => artist.countryId));
    },
    list(state) {
      return year => {
        const list = useRepo(List)
          .with('songs', query => query.with('album').with('artist'))
          .find(year?.yyyy)
        if (list) {
          return list.songs
        } else {
          return []
        }
      }
    },
    listTop100(state) {
      return year => {
        const list = useRepo(List)
          .with('top100Songs', query => query.with('album').with('artist'))
          .find(year.yyyy)
        if (list) {
          return list.top100Songs
        } else {
          return []
        }
      }
    },
    lastSong(state) {
      return _.first(this.list(this.currentYear));
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
        return this.currentYear.previous()
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
    songsForLinks(songs) {
      this.songIdsByTitle = _.mapValues(
        _.groupBy(songs, song => song.title.toLowerCase()),
        songs => songs.map(song => song.id)
      )
    },
    artistsForLinks(artists) {
      this.artistIdsByFullName = _.mapValues(
        _.groupBy(artists, artist => artist.fullName.toLowerCase()),
        artists => artists.map(artist => artist.id)
      )
      this.artistIdsByName = _.mapValues(
        _.groupBy(artists, artist => artist.name.toLowerCase()),
        artists => artists.map(artist => artist.id)
      )
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
