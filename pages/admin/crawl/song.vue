<template lang="pug">
Title Admin: crawler output (songs)
div
  div.flexTitle
    h2 Admin: crawler output (songs)

  h3 Volgende voorstel van crawler

  admin-crawl-process(type="song")
</template>

<script setup>
definePageMeta({ middleware: 'admin' })

const {$api} = useNuxtApp()
</script>
