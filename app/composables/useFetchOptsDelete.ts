
export default function (opts: Record<string, unknown> = {}) {
  opts.method = 'DELETE'
  return useFetchOpts(opts)
}
