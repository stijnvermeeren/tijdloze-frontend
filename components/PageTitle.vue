<template>
  <div>
    <div class="icon"><img :src="`/images/icon/${icon}.png`" :alt="iconAlt" class="icon" /></div>
    <div class="pageTitle">
      <slot />
    </div>
  </div>
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
