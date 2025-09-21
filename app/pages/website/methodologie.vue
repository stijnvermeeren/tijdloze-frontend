<template lang="pug">
Title Methodologie
div
  h2 Methodologie

  ui-tabs(:tabs="tabs")
    nuxt-page
</template>

<script setup>
const tabs = [
  { title: 'Lijsten', to: '/website/methodologie' },
  { title: 'Schrijfwijze', to: '/website/methodologie/schrijfwijze' },
  { title: 'Album en jaartal', to: '/website/methodologie/album' },
  { title: 'Landen', to: '/website/methodologie/landen' },
  { title: 'Talen', to: '/website/methodologie/talen' },
  { title: 'Lead vocals', to: '/website/methodologie/leadvocals' }
]
</script>