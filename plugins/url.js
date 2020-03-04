
import url from 'url';

export default ({ app, store }, inject) => {
  inject('url', {
    // Return websocket URL that uses wss/ws depending on whether API_URI_CLIENT uses https/http
    websocket(path) {
      const websocketUrl = url.parse(process.env.API_URI_CLIENT)
      websocketUrl.protocol = (websocketUrl.protocol === "https:") ? "wss:" : "ws:"
      return websocketUrl.resolve(path)
    }
  });
}
