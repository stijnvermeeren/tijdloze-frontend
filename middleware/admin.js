
export default function ({ store, redirect }) {
  if (!store.getters.isAdmin) {
    redirect('/')
  }
}
