import {useAuthStore} from "~/stores/auth";

export const create404Error = () => {
  throw createError({ statusCode: 404, statusMessage: 'Pagina niet gevonden' })
}
