export const useApiFetchDelete = (request, opts = {}) => {
  return useApiFetch(request, {
    method: 'DELETE',
    ...opts
  })
}
