
export default function ({ $config, $axios, store }) {
  if (process.server) {
    $axios.defaults.baseURL = $config.apiUriServer;
  } else {
    $axios.defaults.baseURL = $config.apiUriClient;
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
