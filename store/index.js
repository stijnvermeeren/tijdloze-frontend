import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core'
import _ from 'lodash';

import Album from './Album';
import Artist from './Artist';
import Song from './Song';
import Year from './Year';

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

const createStore = () => {
  return new Vuex.Store({
    plugins: [
      VuexORM.install(database)
    ],
    state: {
      accessToken: null,
      user: null,
      yearsRaw: [],
      countries: [],
      languages: [],
      vocalsGenders: []
    },
    getters: {
      isAuthenticated(state) {
        return !!state.user;
      },
      displayName(state) {
        if (state.user) {
          return state.user.displayName;
        }
      },
      displayNameWithFallback(state, getters) {
        if (state.user) {
          if (state.user.displayName) {
            return state.user.displayName;
          } else if (state.user.name) {
            return state.user.name;
          } else {
            return state.user.email;
          }
        }
      },
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
          song => song.position(year)
        );
      }
    },
    mutations: {
      updateCoreData(state, json) {
        state.countries = json.countries;
        state.languages = json.languages;
        state.vocalsGenders = json.vocalsGenders;
        state.yearsRaw = json.years;
      },
      setAccessToken(state, accessToken) {
        state.accessToken = accessToken || null
      },
      setUser(state, user) {
        state.user = user || null
      }
    },
    actions: {
      async nuxtServerInit({commit, dispatch}, {app}) {
        console.time('init');
        const response = await app.$axios.$get('core-data');
        console.timeEnd('init');

        console.time('process');
        commit('updateCoreData', response);

        dispatch('entities/artists/create', {
          data: _.sortBy(
            response.artists,
            artist => [artist.name.toLowerCase(), artist.firstName.toLowerCase()]
          )
        });

        dispatch('entities/albums/create', {
          data: _.sortBy(
            response.albums,
            album => [album.releaseYear, album.title.toLowerCase()]
          )
        });

        dispatch('entities/songs/create', {
          data: response.songs
        });
        console.timeEnd('process');
      }
    }
  });
};

export default createStore;
