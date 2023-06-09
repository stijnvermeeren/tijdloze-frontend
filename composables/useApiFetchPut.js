export const useApiFetchPut = (request, data, opts = {}) => {
  return useApiFetchData(request, 'PUT', data, opts)
}
