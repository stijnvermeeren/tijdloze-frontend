<template lang="pug">
  span
    span(v-if='song.notInList(year, true)') -
    span(v-else-if='song.position(year, true)') {{song.position(year, true)}}
    span(v-else) ?
</template>

<script>
  export default {
    props: ["song", "year"]
  }
</script>
