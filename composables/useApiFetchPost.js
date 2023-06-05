export const useApiFetchPost = (request, data, opts = {}) => {
  return useApiFetchData(request, 'POST', data, opts)
}
