<template>
    <svg :class="['colorLabel', 'color-' + index]"><rect class="coloredRect" x="0" y="0" width="30" height="14"></rect></svg>
</template>

<script>
  export default {
    props: ['index']
  }
</script>

<style lang="less" scoped>
    @import "../../assets/graphColors.less";

    svg.colorLabel {
        width: 30px;
        height: 14px;
    }
</style>
