<template lang="pug">
Title Admin: crawler output (albums)
div
  div.flexTitle
    h2 Admin: crawler output (albums)

  h3 Volgende voorstel van crawler

  admin-crawl-process(type="album")
</template>

<script setup>
definePageMeta({ middleware: 'admin' })
</script>
