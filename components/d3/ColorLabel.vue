<template lang="pug">
  svg(:class="['colorLabel', 'color-' + index]")
    rect.coloredRect(x='0' y='0' width='30' height='14')
</template>

<script>
  export default {
    props: {
      index: Number
    }
  }
</script>

<style lang="scss" scoped>
  @use "../../assets/graphColors";

  svg.colorLabel {
    width: 30px;
    height: 14px;
  }
</style>
