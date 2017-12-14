import Vuex from 'vuex';
import _ from 'lodash';

import Artist from './Artist';
import Song from './Song';
import Year from './Year';
import Years from './Years';

function objectWithIdKeys(values) {
  let result = {};
  values.forEach(value => result[value.id] = value);
  return result;
}

const createStore = () => {
  return new Vuex.Store({
    state: {
      songsRaw: [],
      artistsRaw: [],
      albums: [],
      yearsRaw: [],
      countries: []
    },
    getters: {
      years: state => new Years(state.yearsRaw.map(yyyy => new Year(yyyy))),
      artists: state => state.artistsRaw.map(artist => new Artist(artist)),
      songs: (state, getters) => state.songsRaw.map(song => {
        return new Song(song, getters.albumsById[song.albumId].year, getters.years);
      }),
      artistsById: (state, getters) => objectWithIdKeys(getters.artists),
      songsById: (state, getters) => objectWithIdKeys(getters.songs),
      albumsById: state => objectWithIdKeys(state.albums),
      countriesById: state => objectWithIdKeys(state.countries),
      songsByArtistId: (state, getters) => artistId => {
        return _.sortBy(
          getters.songs.filter(song => song.artistId === artistId),
          song => [song.releaseYear, song.title.toLowerCase()]
        );
      },
      findSongAtPosition: (state, getters) => (year, position) => {
        // TODO: what about an in-progress Tijdloze?
        return getters.songs.find(song => song.position(year) === position);
      }
    },
    mutations: {
      updateCoreData(state, json) {
        state.countries = json.countries;
        state.artistsRaw = _.sortBy(
          json.artists,
          artist => [artist.name.toLowerCase(), artist.firstName.toLowerCase()]
        );
        state.songsRaw = json.songs;
        state.albums = json.albums;
        state.yearsRaw = json.years;
      }
    },
    actions: {
      async nuxtServerInit({commit}, {app}) {
        const response = await app.$axios.$get('core-data');
        commit('updateCoreData', response);
      }
    }
  });
};

export default createStore;
