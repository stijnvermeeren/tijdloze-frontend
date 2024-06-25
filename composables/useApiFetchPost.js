export default function (request, data, opts = {}) {
  return useApiFetchData(request, 'POST', data, opts)
}
