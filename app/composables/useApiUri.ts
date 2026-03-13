export default function () {
  const config = useRuntimeConfig()

  if (import.meta.server) {
    return config.public.apiUriServer;
  } else {
    return config.public.apiUriClient;
  }
}