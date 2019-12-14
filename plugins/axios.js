const config = require('~/config.json');

export default function ({ $axios, store }) {
  if (process.server) {
    $axios.defaults.baseURL = config.API_URI_SERVER;
  } else {
    $axios.defaults.baseURL = config.API_URI_CLIENT;
  }

  $axios.interceptors.request.use(function(config) {
    const token = store.state.auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, function(err) {
    return Promise.reject(err);
  });
}
