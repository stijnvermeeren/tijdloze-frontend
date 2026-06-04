export default function (name: string) {
  const route = useRoute()
  const value = route.params[name]

  if (Array.isArray(value)) {
    return value[0] ?? undefined
  }

  return value ?? undefined
}