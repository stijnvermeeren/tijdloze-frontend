import {useAuthStore} from "~/stores/auth";

export const useApiFetch = (request, opts) => {
  const apiUri = useApiUri()
  const authStore = useAuthStore()

  const token = authStore.accessToken;
  const headers = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return useFetch(request, { baseURL: apiUri, headers: headers, ...opts })
}
