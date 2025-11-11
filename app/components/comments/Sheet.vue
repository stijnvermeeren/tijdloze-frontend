<template lang="pug">
v-sheet.comment(:elevation="1" rounded outlined)
  div.commentHeader
    slot(name="header")
  div
    slot
</template>

<script setup>
</script>

<style lang="scss" scoped>
  @use "../../assets/styleConfig";

  .comment {
    padding: 0.5em 2em;
    margin-bottom: 2px;
    &.mine {
      .commentHeader :deep(span.name) {
        font-style: italic;
      }
    }
    div.commentHeader {
      margin-bottom: 0.2em;
      :deep(span.name) {
        font-weight: bold;
      }
    }
  }

  div.deleted {
    font-style: italic;
  }
</style>
