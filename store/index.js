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
  exitSongIds: []
})

export const getters = {
  songs(state, getters) {
    return _.sortBy(
      getters['entities/songs/query']().withAll().all(),
      song => [song.title, song.album.releaseYear]
    );
  },
  songsForLinks(state, getters) {
    return _.groupBy(Song.all(), song => song.title.toLowerCase())
  },
  artistsFullNameForLinks(state, getters) {
    return _.groupBy(Artist.all(), artist => artist.fullName.toLowerCase())
  },
  artistsNameForLinks(state, getters) {
    return _.groupBy(Artist.all(), artist => artist.name.toLowerCase())
  },
  decades(state, getters) {
    function getDecadeYear(yyyy) {
      return yyyy - yyyy % 10;
    }

    const startYear = _.min(getters.songs.map(song => song.releaseYear));
    const endYear = getters.currentYear.yyyy;
    const decades = [];
    for (let decadeYear = getDecadeYear(startYear); decadeYear <= endYear; decadeYear += 10) {
      decades.push({ decadeYear, name: `De jaren '${decadeYear.toString().substring(2,4)}` })
    }
    return decades.reverse();
  },
  years: state => state.yearsRaw.map(yyyy => new Year(yyyy, state.yearsRaw)),
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
    const response = await this.$axios.$get('core-data');

    commit('updateCoreData', response);

    if (getters.listInProgress) {
      const poll = await this.$axios.$get('poll/latest');
      if (poll.year === getters.currentYear.yyyy) {
        commit('poll/setCurrentPoll', poll);
      }
    }

    dispatch('entities/artists/create', {
      data: response.artists
    });

    dispatch('entities/albums/create', {
      data: response.albums
    });

    dispatch('entities/songs/create', {
      data: response.songs
    });

    const lists = response.lists.map(list => {
      list.top100SongIds = _.take(list.songIds, list.top100SongCount)
      return list
    })
    dispatch('entities/lists/create', {
      data: lists
    });
  }
}
