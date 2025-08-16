
export default function (opts = {}) {
  opts['method'] = 'DELETE'
  return useFetchOpts(opts)
}
