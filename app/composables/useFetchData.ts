type FetchDataOptions = Record<string, unknown>

export default function <TOptions extends FetchDataOptions = FetchDataOptions>(
  data: unknown,
  opts: TOptions = {} as TOptions
): TOptions & { headers?: Record<string, string>; body?: string } {
  if (data !== undefined && data !== null) {
    return {
      ...opts,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    }
  }

  return opts
}
