
export default function (data: unknown, opts: Record<string, unknown> = {}) {
  const putOpts = { ...opts, method: 'PUT' as const }
  return useFetchOpts(useFetchData(data, putOpts))
}
