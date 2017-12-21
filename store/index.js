import Vuex from 'vuex';
import _ from 'lodash';

import Artist from './Artist';
import Song from './Song';
import Year from './Year';

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
      countries: [],
      languages: []
    },
    getters: {
      years: state => state.yearsRaw.map(yyyy => new Year(yyyy, state.yearsRaw)),
      currentYear: (state, getters) => _.last(getters.years),
      artists: state => state.artistsRaw.map(artist => new Artist(artist)),
      songs: (state, getters) => _.sortBy(
        state.songsRaw.map(song => {
          return new Song(song, getters.albumsById[song.albumId].releaseYear, getters.years);
        }),
        song => song.title.toLowerCase()
      ),
      artistsById: (state, getters) => objectWithIdKeys(getters.artists),
      songsById: (state, getters) => objectWithIdKeys(getters.songs),
      albumsById: state => objectWithIdKeys(state.albums),
      countriesById: state => objectWithIdKeys(state.countries),
      languagesById: state => objectWithIdKeys(state.languages),
      songsByArtistId: (state, getters) => artistId => {
        return _.sortBy(
          getters.songs.filter(song => song.artistId === artistId),
          [song => song.releaseYear], [song => song.title.toLowerCase()]
        );
      },
      songsByAlbumId: (state, getters) => albumId => {
        return getters.songs.filter(song => song.albumId === albumId);
      },
      albumsByArtistId: (state, getters) => artistId => {
        return state.albums.filter(album => album.artistId === artistId);
      },
      findSongAtPosition: (state, getters) => (year, position) => {
        // TODO: what about an in-progress Tijdloze?
        return getters.songs.find(song => song.position(year) === position);
      }
    },
    mutations: {
      updateCoreData(state, json) {
        state.countries = json.countries;
        state.languages = json.languages;
        state.artistsRaw = _.sortBy(
          json.artists,
          artist => [artist.name.toLowerCase(), artist.firstName.toLowerCase()]
        );
        state.songsRaw = json.songs;
        state.albums = _.sortBy(
          json.albums,
          album => [album.releaseYear, album.title.toLowerCase()]
        );
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
