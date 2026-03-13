export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface ApiEndpoint<TResponse, TBody = undefined> {
  path: string
  method: ApiMethod
}

export function endpoint<TResponse, TBody = undefined>(
  path: string,
  method: ApiMethod = 'GET'
): ApiEndpoint<TResponse, TBody> {
  return { path, method }
}