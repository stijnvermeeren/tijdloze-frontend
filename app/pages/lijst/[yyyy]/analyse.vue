<template lang="pug">
.analysis
  div(v-for='text in analysis')
    make-links(:text='text')
</template>

<script setup>
const props = defineProps({
  analysis: Array
})
</script>


<style lang="scss" scoped>
div.analysis {
  font-size: 14px;

  div {
    padding-bottom: 6px;
    margin-bottom: 6px;
    border-bottom: 1px dotted #ddd;
  }
}

</style>
