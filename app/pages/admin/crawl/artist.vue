<template lang="pug">
Title Admin: crawler output (artiesten)
div
  div.flexTitle
    h2 Admin: crawler output (artiesten)

  h3 Volgende voorstel van crawler

  admin-crawl-process(type="artist")
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin' })
</script>
