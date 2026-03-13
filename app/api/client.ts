import type { ApiEndpoint } from '~/api/endpoints'

export type ApiResponse<TEndpoint extends ApiEndpoint<unknown, unknown>> =
  TEndpoint extends ApiEndpoint<infer TResponse, unknown> ? TResponse : never

export type ApiBody<TEndpoint extends ApiEndpoint<unknown, unknown>> =
  TEndpoint extends ApiEndpoint<unknown, infer TBody> ? TBody : never

export type ApiRequestOptions = Record<string, unknown>

export interface TypedApi {
  <TEndpoint extends ApiEndpoint<unknown, undefined>>(
    endpoint: TEndpoint,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<TEndpoint>>
  <TEndpoint extends ApiEndpoint<unknown, unknown>>(
    endpoint: TEndpoint,
    body: ApiBody<TEndpoint>,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<TEndpoint>>
}

export function buildApiOptions(
  method: ApiEndpoint<unknown, unknown>['method'],
  body?: unknown,
  opts: ApiRequestOptions = {},
): ApiRequestOptions {
  if (method === 'GET' || method === 'DELETE') {
    return { ...opts, method }
  }

  if (body !== undefined && body !== null) {
    return {
      ...opts,
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    }
  }

  return { ...opts, method }
}

export function buildApiCall(
  input: ApiEndpoint<unknown, unknown>,
  arg1?: unknown,
  arg2: ApiRequestOptions = {},
): { path: string; options: ApiRequestOptions } {
  if (input.method === 'GET' || input.method === 'DELETE') {
    return {
      path: input.path,
      options: buildApiOptions(input.method, undefined, (arg1 as ApiRequestOptions | undefined) ?? {}),
    }
  }

  return {
    path: input.path,
    options: buildApiOptions(input.method, arg1, arg2),
  }
}
