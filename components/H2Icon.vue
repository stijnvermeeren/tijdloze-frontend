<template>
    <img :src="`/images/icon/${name}.png`" :alt="alt" class="icon" />
</template>

<script>
  export default {
    props: ['name', 'alt']
  }
</script>

<style scoped>
    img.icon {
        vertical-align: bottom;
        margin-right: 10px;
    }
</style>
