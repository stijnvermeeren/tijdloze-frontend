import VuexORM from '@vuex-orm/core'
import _ from 'lodash';

import Album from '~/orm/Album';
import Artist from '~/orm/Artist';
import Song from '~/orm/Song';
import Year from '~/orm/Year';

function objectWithIdKeys(values) {
  const result = {};
  values.forEach(value => result[value.id] = value);
  return result;
}

const database = new VuexORM.Database();
const songs = {};
const artists = {};
const albums = {};
database.register(Song, songs);
database.register(Artist, artists);
database.register(Album, albums);

export const plugins = [ VuexORM.install(database) ]

export const state = () => ({
  yearsRaw: [],
  exitSongIds: [],
  countries: [],
  languages: [],
  vocalsGenders: []
})

export const getters = {
  songs(state, getters) {
    return _.sortBy(
      getters['entities/songs/query']().withAll().all(),
      song => [song.title, song.album.releaseYear]
    );
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
      return getters.songs.find(song => song.position(year) === 1);
    });
  },
  countriesById: state => objectWithIdKeys(state.countries),
  languagesById: state => objectWithIdKeys(state.languages),
  vocalsGendersById: state => objectWithIdKeys(state.vocalsGenders),
  list: (state, getters) => (year, extended) => {
    return _.sortBy(
      getters.songs.filter(song => song.position(year, extended)),
      song => song.position(year, extended)
    );
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
    state.countries = _.sortBy(
      json.countries,
      country => country.name
    );
    state.languages = _.sortBy(
      json.languages,
      language => language.name
    );
    state.vocalsGenders = json.vocalsGenders;
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
  async nuxtServerInit({commit, dispatch}) {
    const response = await this.$axios.$get('core-data');

    commit('updateCoreData', response);

    dispatch('entities/artists/create', {
      data: response.artists
    });

    dispatch('entities/albums/create', {
      data: response.albums
    });

    dispatch('entities/songs/create', {
      data: response.songs
    });
  }
}
