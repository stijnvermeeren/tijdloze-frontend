<template lang="pug">
div
  h2 Pagina niet gevonden
  div
    | Ga naar de
    |
    nuxt-link(to="/") startpagina
    | .
</template>

<script>

  export default {
    head: {
      title: 'Pagina niet gevonden'
    }
  }
</script>
