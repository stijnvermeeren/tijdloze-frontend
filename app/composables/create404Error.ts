import {useAuthStore} from "~/stores/auth";

export default function () {
  throw createError({ statusCode: 404, statusMessage: 'Pagina niet gevonden' })
}
