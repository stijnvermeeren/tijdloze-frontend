<template lang="pug">
div.pageTitleContainer
  .icon
    img.icon(:src='`/images/icon/${icon}.png`' :alt='iconAlt')
  .pageTitle
    slot
</template>

<script>
  export default {
    name: 'PageTitle',
    props: {
      icon: String,
      iconAlt: String
    }
  }
</script>

<style lang="scss" scoped>
  div.icon {
    display: inline-block;
    vertical-align: baseline;
    margin-right: 20px;
  }
  div.pageTitle {
    display: inline-block;
  }
</style>
