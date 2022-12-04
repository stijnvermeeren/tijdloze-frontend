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
  /* songs: (state, getters) => _.sortBy(
    state.songsRaw.map(song => {
      return new Song(song, getters.albumsById[song.albumId].releaseYear, getters.years);
    }),
    song => song.title.toLowerCase()
  ), */
  completedYears (state, getters) {
    return getters.years.filter(year => {
      const list = List.query().with('songs').find(year.yyyy)
      if (list) {
        const firstSong = _.first(list.songs)
        return firstSong && firstSong.position(year) === 1;
      }
    });
  },
  usedCountryIds (state, getters) {
    return new Set(Artist.all().map(artist => artist.countryId));
  },
  list: (state, getters) => (year, extended) => {
    const list = List.query().with(['songs', 'songs.album', 'songs.artist']).find(year.yyyy)
    if (list) {
      if (extended) {
        return list.songs
      } else {
        return _.takeWhile(list.songs, song => song.position(year, true) <= 100)
      }
    } else {
      return []
    }
  },
  lastSong(state, getters) {
    return _.first(getters.list(getters.currentYear, true));
  },
  lastPosition(state, getters) {
    if (getters.lastSong) {
      return getters.lastSong.position(getters.currentYear, true)
    } else {
      return undefined
    }
  },
  listInProgress(state, getters) {
    return getters.lastPosition !== 1;
  },
  completedYear(state, getters) {
    return getters.lastPosition === 1 ? getters.currentYear : getters.currentYear.previous();
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

    dispatch('entities/lists/create', {
      data: response.lists
    });
  }
}
