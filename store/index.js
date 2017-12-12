import Vuex from 'vuex';
import axios from '../axios.js';

const createStore = () => {
  return new Vuex.Store({
    state: {
      coreData: {
        songs: [],
        artists: [],
        albums: []
      },
      years: [1987, 1988, 1990]
    },
    getters: {
      artistById: (state) => (id) => {
        return state.coreData.artists[id];
      },
      findSongAtPosition: (state) => (year, position) => {
        const yearKey = year.toString().substr(2, 2);
        // TODO: what about an in-progress Tijdloze?
        return Object.values(state.coreData.songs).find(function (coreSong) {
          return coreSong.positions[yearKey] === position;
        });
      }
    },
    mutations: {
      updateCoreData(state, json) {
        function objectWithIdKeys(values) {
          let result = {};
          values.forEach(function (value) {
            result[value.id] = value;
          });
          return result;
        }

        state.coreData = {
          artists: objectWithIdKeys(json.artists),
          songs: objectWithIdKeys(json.songs)
        }
      }
    },
    actions: {
      nuxtServerInit(commit) {
        axios.get('core-data').then(response => {
          commit('updateCoreData', response.data);
        });
      }
    }
  });
};

export default createStore;
