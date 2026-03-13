import type { ApiEndpoint } from '~/api/endpoints'

type ApiResponse<TEndpoint extends ApiEndpoint<unknown, unknown>> =
  TEndpoint extends ApiEndpoint<infer TResponse, unknown> ? TResponse : never

type ApiFetchOptions = Record<string, unknown>
type ApiPathInput = string | (() => string)
type ApiEndpointInput<TEndpoint extends ApiEndpoint<unknown, unknown>> = TEndpoint | (() => TEndpoint)

function apiFetch<TResponse>(path: ApiPathInput, opts: ApiFetchOptions) {
  const { $rawApi } = useNuxtApp()
  return useFetch<TResponse>(path, {
    ...opts,
    $fetch: $rawApi,
  })
}

export default function useApiFetch<
  TEndpoint extends ApiEndpoint<unknown, unknown>,
  TOptions extends ApiFetchOptions = ApiFetchOptions,
>(endpoint: ApiEndpointInput<TEndpoint>, opts: TOptions = {} as TOptions) {
  const endpointPath = typeof endpoint === 'function'
    ? () => endpoint().path
    : endpoint.path
  const endpointMethod = typeof endpoint === 'function'
    ? () => endpoint().method
    : endpoint.method

  return apiFetch<ApiResponse<TEndpoint>>(endpointPath, {
    ...opts,
    method: endpointMethod,
  })
}

export function useApiFetchByPath<TResponse = unknown, TOptions extends ApiFetchOptions = ApiFetchOptions>(
  path: ApiPathInput,
  opts: TOptions = {} as TOptions,
) {
  return apiFetch<TResponse>(path, opts)
}
