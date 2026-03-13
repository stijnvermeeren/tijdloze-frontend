import type { ApiBody, ApiRequestOptions, ApiResponse } from '~/api/client'
import type { ApiEndpoint } from '~/api/endpoints'

export default function useApiRequest<TEndpoint extends ApiEndpoint<unknown, undefined>>(
  endpoint: TEndpoint,
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
  if (endpoint.method === 'GET' || endpoint.method === 'DELETE') {
    const opts = (arg2 as ApiRequestOptions | undefined) ?? {}
    return await useNuxtApp().$api(endpoint, opts)
  }

  return await useNuxtApp().$api(endpoint, arg2 as ApiBody<TEndpoint>, arg3)
}
