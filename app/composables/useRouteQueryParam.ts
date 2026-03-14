export default function (name: string, route: ReturnType<typeof useRoute> = useRoute()) {
  const value = route.query[name]

  if (Array.isArray(value)) {
    return value[0] ?? undefined
  }

  return value ?? undefined
}