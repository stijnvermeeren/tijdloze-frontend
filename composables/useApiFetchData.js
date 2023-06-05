export const useApiFetchData = (request, method, data, opts = {}) => {
  if (!! data) {
    opts.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8'
    }
    opts.body = JSON.stringify( data )
  }

  return useApiFetch(request, {
    method,
    ...opts
  })
}
