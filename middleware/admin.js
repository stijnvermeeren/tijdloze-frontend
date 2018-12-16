
export default function ({ store, redirect, route }) {
  if (!store.getters.isAdmin) {
    redirect('/auth/admin', { redirect: route.path })
  }
}
