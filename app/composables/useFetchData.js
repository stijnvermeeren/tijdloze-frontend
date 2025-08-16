export default function (data, opts = {}) {
  if (!! data) {
    opts.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8'
    }
    opts.body = JSON.stringify( data )
  }

  return opts
}
