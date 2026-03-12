type FetchOptions = Record<string, unknown>

export default function <TOptions extends FetchOptions = FetchOptions>(
  opts: TOptions = {} as TOptions
): TOptions & { $fetch: ReturnType<typeof useNuxtApp>['$api'] } {
  return { $fetch: useNuxtApp().$api, ...opts }
}
