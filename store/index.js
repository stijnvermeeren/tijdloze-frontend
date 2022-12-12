import VuexORM from '@vuex-orm/core'
import _ from 'lodash';

import Album from '~/orm/Album';
import Artist from '~/orm/Artist';
import Song from '~/orm/Song';
import Year from '~/orm/Year';
import List from '~/orm/List';

const database = new VuexORM.Database();
const songs = {};
const artists = {};
const albums = {};
const lists = {};
database.register(Song, songs);
database.register(Artist, artists);
database.register(Album, albums);
database.register(List, lists);

export const plugins = [ VuexORM.install(database) ]

export const state = () => ({
  yearsRaw: [],
  exitSongIds: [],
  songIdsByTitle: {},
  artistIdsByName: {},
  artistIdsByFullName: {},
  commentsOn: true,
  chatOn: false
})

export const getters = {
  songs(state, getters) {
    return _.sortBy(
      getters['entities/songs/query']().withAll().all(),
      song => [song.title, song.album.releaseYear]
    );
  },
  years: state => state.yearsRaw.map(yyyy => new Year(yyyy, state.yearsRaw)),
  year: state => yyyy => new Year(yyyy, state.yearsRaw),
  currentYear: (state, getters) => _.last(getters.years),
  usedCountryIds (state, getters) {
    return new Set(Artist.all().map(artist => artist.countryId));
  },
  list: (state, getters) => year => {
    const list = List.query().with(['songs', 'songs.album', 'songs.artist']).find(year.yyyy)
    if (list) {
      return list.songs
    } else {
      return []
    }
  },
  listTop100: (state, getters) => year => {
    const list = List.query().with(['top100Songs', 'top100Songs.album', 'top100Songs.artist']).find(year.yyyy)
    if (list) {
      return list.top100Songs
    } else {
      return []
    }
  },
  lastSong(state, getters) {
    return _.first(getters.list(getters.currentYear));
  },
  lastPosition(state, getters) {
    const lastSong = getters.lastSong
    if (lastSong) {
      return lastSong.position(getters.currentYear, true)
    } else {
      return undefined
    }
  },
  listInProgress(state, getters) {
    return getters.lastPosition !== 1;
  },
  lastCompleteYear(state, getters) {
    if (getters.listInProgress) {
      return getters.currentYear.previous()
    } else {
      return getters.currentYear
    }
  }
}

export const mutations = {
  setCommentsOn(state, commentsOn) {
    state.commentsOn = commentsOn
  },
  setChatOn(state, chatOn) {
    state.chatOn = chatOn
  },
  songsForLinks(state, songs) {
    state.songIdsByTitle = _.mapValues(
      _.groupBy(songs, song => song.title.toLowerCase()),
      songs => songs.map(song => song.id)
    )
  },
  artistsForLinks(state, artists) {
    state.artistIdsByFullName = _.mapValues(
      _.groupBy(artists, artist => artist.fullName.toLowerCase()),
      artists => artists.map(artist => artist.id)
    )
    state.artistIdsByName = _.mapValues(
      _.groupBy(artists, artist => artist.name.toLowerCase()),
      artists => artists.map(artist => artist.id)
    )
  },
  updateCoreData(state, json) {
    state.yearsRaw = json.years;
    state.exitSongIds = json.exitSongIds;
  },
  setExitSongIds(state, exitSongIds) {
    state.exitSongIds = exitSongIds
  },
  setCurrentYear(state, currentYear) {
    if (_.last(state.yearsRaw) !== currentYear) {
      state.yearsRaw = state.yearsRaw.filter(year => year < currentYear)
      state.yearsRaw.push(currentYear)
    }
  },
}

export const actions = {
  async nuxtServerInit({commit, dispatch, getters}) {
    const [chatOnResponse, commentsOnResponse, coreDataResponse] = await Promise.all([
      this.$axios.$get(`text/chatOn`),
      this.$axios.$get(`text/commentsOn`),
      this.$axios.$get('core-data')
    ])
    commit('setChatOn', chatOnResponse.value === 'on')
    commit('setCommentsOn', commentsOnResponse.value === 'on')
    commit('updateCoreData', coreDataResponse);

    if (getters.listInProgress) {
      const poll = await this.$axios.$get('poll/latest');
      if (poll.year === getters.currentYear.yyyy) {
        commit('poll/setCurrentPoll', poll);
      }
    }

    dispatch('entities/artists/create', {
      data: coreDataResponse.artists
    });

    dispatch('entities/albums/create', {
      data: coreDataResponse.albums
    });

    dispatch('entities/songs/create', {
      data: coreDataResponse.songs
    });

    const lists = coreDataResponse.lists.map(list => {
      list.top100SongIds = _.take(list.songIds, list.top100SongCount)
      return list
    })
    dispatch('entities/lists/create', {
      data: lists
    });

    commit('songsForLinks', Song.all())
    commit('artistsForLinks', Artist.all())
  }
}
