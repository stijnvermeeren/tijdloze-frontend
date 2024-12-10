
export default function (data, opts = {}) {
  opts['method'] = 'PUT'
  return useFetchOpts(useFetchData(data, opts))
}
