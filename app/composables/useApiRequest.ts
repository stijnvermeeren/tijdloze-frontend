import type { ApiBody, ApiRequestOptions, ApiResponse } from '~/api/client'
import type { ApiEndpoint, MutationMethod, ReadOnlyMethod } from '~/api/endpoints'

export default function useApiRequest<TEndpoint extends ApiEndpoint<unknown, undefined, ReadOnlyMethod>>(
  endpoint: TEndpoint,
  opts?: ApiRequestOptions,
): Promise<ApiResponse<TEndpoint>>

export default function useApiRequest<TEndpoint extends ApiEndpoint<unknown, undefined, MutationMethod>>(
  endpoint: TEndpoint,
  body: undefined,
  opts?: ApiRequestOptions,
): Promise<ApiResponse<TEndpoint>>

export default function useApiRequest<TEndpoint extends ApiEndpoint<unknown, unknown>>(
  endpoint: TEndpoint,
  body: ApiBody<TEndpoint>,
  opts?: ApiRequestOptions,
): Promise<ApiResponse<TEndpoint>>

export default async function useApiRequest<TEndpoint extends ApiEndpoint<unknown, unknown>>(
  endpoint: TEndpoint,
  arg2?: ApiBody<TEndpoint> | ApiRequestOptions,
  arg3: ApiRequestOptions = {},
): Promise<ApiResponse<TEndpoint>> {
  // Cast to the underlying implementation signature to bypass overload resolution
  type ApiImpl = (input: ApiEndpoint<unknown, unknown>, arg1?: unknown, arg2?: ApiRequestOptions) => Promise<ApiResponse<TEndpoint>>
  const apiImpl = useNuxtApp().$api as unknown as ApiImpl

  if (endpoint.method === 'GET' || endpoint.method === 'DELETE') {
    const opts = (arg2 as ApiRequestOptions | undefined) ?? {}
    return await apiImpl(endpoint, opts)
  }

  return await apiImpl(endpoint, arg2 as ApiBody<TEndpoint>, arg3)
}
