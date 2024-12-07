import {useAuthStore} from "~/stores/auth";

export default function (opts = {}) {
  const apiUri = useApiUri()
  const authStore = useAuthStore()

  const token = authStore.accessToken;
  opts.headers = opts.headers || {}
  if (token) {
    opts.headers.Authorization = `Bearer ${token}`;
  }

  return { baseURL: apiUri, ...opts }
}
