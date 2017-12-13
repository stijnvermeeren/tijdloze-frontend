import Vuex from 'vuex';
import _ from 'lodash';

function objectWithIdKeys(values) {
  let result = {};
  values.forEach(value => result[value.id] = value);
  return result;
}

const createStore = () => {
  return new Vuex.Store({
    state: {
      songs: [],
      artists: [],
      albums: [],
      years: [],
      countries: []
    },
    getters: {
      artistsById: state => objectWithIdKeys(state.artists),
      songsById: state => objectWithIdKeys(state.songs),
      albumsById: state => objectWithIdKeys(state.albums),
      countriesById: state => objectWithIdKeys(state.countries),
      songsByArtistId: (state, getters) => artistId => {
        return _.sortBy(
          state.songs.filter(song => song.artistId === artistId),
          song => [getters.albumsById[song.albumId].year, song.title.toLowerCase()]
        );
      },
      findSongAtPosition: (state) => (year, position) => {
        const yearKey = year.toString().substr(2, 2);
        // TODO: what about an in-progress Tijdloze?
        return state.songs.find(song =>
          song.positions[yearKey] === position
        );
      }
    },
    mutations: {
      updateCoreData(state, json) {
        state.countries = json.countries;
        state.artists = _.sortBy(
          json.artists,
          artist => [artist.name.toLowerCase(), artist.firstName.toLowerCase()]
        );
        state.songs = json.songs;
        state.albums = json.albums;
        state.years = json.years;
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
