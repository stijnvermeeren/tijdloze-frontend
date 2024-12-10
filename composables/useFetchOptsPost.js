
export default function (data = undefined, opts = {}) {
  opts['method'] = 'POST'
  return useFetchOpts(useFetchData(data, opts))
}
