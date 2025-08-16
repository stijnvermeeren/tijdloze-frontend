export default function (opts = {}) {
  return { $fetch: useNuxtApp().$api, ...opts }
}
