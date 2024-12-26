import { defineStore } from 'pinia'
import { useRepo } from 'pinia-orm'
import _ from 'lodash';

import Artist from '~/orm/Artist';
import Song from '~/orm/Song';
import Year from '~/orm/Year';
import List from '~/orm/List';
import ListEntry from "~/orm/ListEntry";

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
      return year => {
        const list = useRepo(List)
          .with('entries', q1 => q1.with('song', q2 => q2.with('album').with('artist')))
          .find(year?.yyyy)
        if (list) {
          return list.entries
        } else {
          return []
        }
      }
    },
    lastSong(state) {
      const list = useRepo(List).find(this.currentYear?.yyyy)
      return useRepo(ListEntry)
          .with('song', q => q.with('album').with('artist'))
          .find(_.first(list?.entryIds))
          .song;
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
