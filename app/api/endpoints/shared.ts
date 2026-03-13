export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type ReadOnlyMethod = 'GET' | 'DELETE'
export type MutationMethod = 'POST' | 'PUT'

export interface ApiEndpoint<TResponse, TBody = undefined, TMethod extends ApiMethod = ApiMethod> {
  path: string
  method: TMethod
}

export function endpoint<TResponse, TBody = undefined>(path: string): ApiEndpoint<TResponse, TBody, 'GET'>
export function endpoint<TResponse, TBody = undefined>(path: string, method: 'GET'): ApiEndpoint<TResponse, TBody, 'GET'>
export function endpoint<TResponse, TBody = undefined>(path: string, method: 'DELETE'): ApiEndpoint<TResponse, TBody, 'DELETE'>
export function endpoint<TResponse, TBody = undefined>(path: string, method: 'POST'): ApiEndpoint<TResponse, TBody, 'POST'>
export function endpoint<TResponse, TBody = undefined>(path: string, method: 'PUT'): ApiEndpoint<TResponse, TBody, 'PUT'>
export function endpoint<TResponse, TBody = undefined>(path: string, method?: ApiMethod): ApiEndpoint<TResponse, TBody> {
  return { path, method: method ?? 'GET' }
}