
export default function (data: unknown = undefined, opts: Record<string, unknown> = {}) {
  opts.method = 'POST'
  return useFetchOpts(useFetchData(data, opts))
}
