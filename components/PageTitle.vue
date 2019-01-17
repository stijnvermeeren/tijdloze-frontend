<template lang="pug">
  div
    .icon
      img.icon(:src='`/images/icon/${icon}.png`' :alt='iconAlt')
    .pageTitle
      slot
</template>

<script>
  export default {
    name: 'PageTitle',
    props: ['icon', 'iconAlt']
  }
</script>

<style lang="less" scoped>
  div.icon {
    img {
      vertical-align: bottom;
      margin-right: 10px;
    }

    float: left;
  }
  div.pageTitle {
    margin: 0 0 20px 50px;
  }
</style>
