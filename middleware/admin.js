
export default function ({ store, redirect, route }) {
  if (!store.getters['auth/isAdmin']) {
    redirect('/auth/admin', { redirect: route.path })
  }
}
