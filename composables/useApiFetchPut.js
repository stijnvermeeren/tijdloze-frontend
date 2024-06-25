export default function (request, data, opts = {}) {
  return useApiFetchData(request, 'PUT', data, opts)
}
