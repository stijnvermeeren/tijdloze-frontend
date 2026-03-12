export default function () {
  const config = useRuntimeConfig()

  if (process.server) {
    return config.public.apiUriServer;
  } else {
    return config.public.apiUriClient;
  }
}