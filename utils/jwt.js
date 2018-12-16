import jwtDecode from 'jwt-decode'

export function secondsToExpiry(token) {
  const jwt = jwtDecode(token);
  if (jwt && jwt.exp) {
    return jwt.exp - Date.now().valueOf() / 1000
  } else {
    return undefined
  }
}
