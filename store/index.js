import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core'
import _ from 'lodash';
import {secondsToExpiry} from '~/utils/jwt'

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
      refreshInterval: null,
      yearsRaw: [],
      countries: [],
      languages: [],
      vocalsGenders: [],
      pollVotes: []
    },
    getters: {
      isAuthenticated(state) {
        return !!state.user;
      },
      isAdmin(state, getters) {
        return getters.isAuthenticated && state.user.isAdmin;
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
          song => song.position(year, extended)
        );
      },
      lastSong(state, getters) {
        return _.first(getters.list(getters.currentYear));
      },
      lastPosition(state, getters) {
        if (getters.lastSong) {
          return getters.lastSong.position(getters.currentYear)
        } else {
          return undefined
        }
      },
      listInProgress(state, getters) {
        return getters.lastPosition !== 1;
      },
      completedYear(state, getters) {
        return getters.lastPosition === 1 ? getters.currentYear : getters.currentYear.previous();
      },
      pollVote: (state) => (pollId) => {
        const vote = state.pollVotes.find(vote => vote.pollId === pollId);
        return vote ? vote.answerId : undefined;
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
        state.accessToken = accessToken || null;

        if (process.client && accessToken) {
          if (secondsToExpiry(accessToken) > 2) {
            setTimeout(() => {
              this.$auth.checkSession();
            }, 1000 * (secondsToExpiry(accessToken) - 2))
          }
        }
      },
      setUser(state, user) {
        state.user = user || null
      },
      setPollVotes(state, votes) {
        state.pollVotes = votes
      },
      setCurrentYear(state, currentYear) {
        if (_.last(state.yearsRaw) !== currentYear) {
          state.yearsRaw = state.yearsRaw.filter(year => year < currentYear)
          state.yearsRaw.push(currentYear)
        }
      },
      setRefreshInterval(state, interval) {
        if (state.refreshInterval) {
          clearInterval(state.refreshInterval)
        }
        state.refreshInterval = interval
      }
    },
    actions: {
      async refreshCurrentList({commit, dispatch}) {
        const response = await this.$axios.$get('current-list', {
          progress: false
        });

        commit('setCurrentYear', response.year)

        Artist.insertOrUpdate({
          data: response.newArtists
        })
        Album.insertOrUpdate({
          data: response.newAlbums
        })
        Song.insertOrUpdate({
          data: response.newSongs
        })

        Song.update({
          where: song => true,
          data: song => {
            song.exitCurrent = response.exits.includes(song.id)

            const entry = response.entries.find(entry => entry.songId == song.id)
            if (entry) {
              song.positions[response.year % 100] = entry.position
            } else {
              delete song.positions[response.year % 100]
            }
          }
        })
      },
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
      },
      setRefreshInterval({commit, dispatch, getters}) {
        const timeout = getters.lastPosition === 1 ? 5 * 60 * 1000 : 15 * 1000;
        const interval = setInterval(() => dispatch('refreshCurrentList'), timeout);
        commit('setRefreshInterval', interval);
      }
    }
  });
};

export default createStore;
