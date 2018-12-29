<template>
  <span class="container">
    <span @click="showInfo = !showInfo" :class="{isAdmin: user.isAdmin}">{{user.displayName}}</span>
    <div v-if="showInfo" class="info">
      <div>Unieke ID: {{user.id}}</div>
      <div v-if="user.isAdmin">Moderator</div>
    </div>
  </span>
</template>

<script>
  export default {
    name: "User",
    props: ['user'],
    data() {
      return {
        showInfo: false
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~assets/globalStyles.less";

  span.container {
    position: relative;

    div.info {
      position: absolute;
      top: 1em;
      background-color: @inputBackgroundColor;
      border: 1px solid gray;
      border-radius: 4px;
      padding: 1px 4px;
    }
  }
</style>
