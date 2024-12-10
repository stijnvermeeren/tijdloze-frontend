export default function (request, method, data, opts = {}) {
  return useApiFetch(request, {
    method,
    ...useFetchData(data)
  })
}
