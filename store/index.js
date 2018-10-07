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
const users = {};
const artists = {};
const albums = {};
database.register(Song, users);
database.register(Artist, artists);
database.register(Album, albums);

const createStore = () => {
  return new Vuex.Store({
    plugins: [
      VuexORM.install(database)
    ],
    state: {
      yearsRaw: [],
      countries: [],
      languages: []
    },
    getters: {
      decades: (state, getters) => {
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
      data: (state, getters) => {
        console.log('data');

        function getDecadeYear(yyyy) {
          return yyyy - yyyy % 10;
        }

        const dataPoints = {};
        getters.decades.forEach(({decadeYear}) => {
          dataPoints[decadeYear] = [];
        });

        getters.years.forEach(year => {
          getters.songs.forEach(song => {
            if (song.position(year)) {
              dataPoints[getDecadeYear(song.releaseYear)].push({
                song: song,
                year: year
              });
            }
          });
        });
        return dataPoints;
      },
      years: state => state.yearsRaw.map(yyyy => new Year(yyyy, state.yearsRaw)),
      currentYear: (state, getters) => _.last(getters.years),
      /* songs: (state, getters) => _.sortBy(
        state.songsRaw.map(song => {
          return new Song(song, getters.albumsById[song.albumId].releaseYear, getters.years);
        }),
        song => song.title.toLowerCase()
      ), */
      countriesById: state => objectWithIdKeys(state.countries),
      languagesById: state => objectWithIdKeys(state.languages),
      list: (state, getters) => year => {
        return _.sortBy(
          getters.songs.filter(song => song.position(year)),
          song => song.position(year)
        );
      }
    },
    mutations: {
      updateCoreData(state, json) {
        state.countries = json.countries;
        state.languages = json.languages;
        state.yearsRaw = json.years;
      }
    },
    actions: {
      async nuxtServerInit({commit, dispatch}, {app}) {
        const response = await app.$axios.$get('core-data');
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
      }
    }
  });
};

export default createStore;
