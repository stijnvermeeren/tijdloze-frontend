export default function (request, opts = {}) {
  return useApiFetch(request, {
    method: 'DELETE',
    ...opts
  })
}
