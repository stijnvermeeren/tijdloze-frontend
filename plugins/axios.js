
export default function ({ $axios, store }) {
  $axios.interceptors.request.use(function(config) {
    const token = store.state.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, function(err) {
    return Promise.reject(err);
  });
}
