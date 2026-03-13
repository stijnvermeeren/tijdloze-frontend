import type { ApiEndpoint } from '~/api/endpoints'

type ApiResponse<TEndpoint extends ApiEndpoint<unknown, unknown>> =
  TEndpoint extends ApiEndpoint<infer TResponse, unknown> ? TResponse : never

type ApiFetchOptions = Record<string, unknown>
type ApiPathInput = string | (() => string)

function apiFetch<TResponse>(path: ApiPathInput, opts: ApiFetchOptions) {
  const { $api } = useNuxtApp()
  return useFetch<TResponse>(path, {
    ...opts,
    $fetch: $api as unknown as typeof $fetch,
  })
}

export default function useApiFetch<
  TEndpoint extends ApiEndpoint<unknown, unknown>,
  TOptions extends ApiFetchOptions = ApiFetchOptions,
>(endpoint: TEndpoint, opts: TOptions = {} as TOptions) {
  return apiFetch<ApiResponse<TEndpoint>>(endpoint.path, {
    ...opts,
    method: endpoint.method,
  })
}

export function useApiFetchByPath<TResponse = unknown, TOptions extends ApiFetchOptions = ApiFetchOptions>(
  path: ApiPathInput,
  opts: TOptions = {} as TOptions,
) {
  return apiFetch<TResponse>(path, opts)
}
