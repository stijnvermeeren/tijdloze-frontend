<template lang="pug">
d3-distribution-graph(:points='data')
</template>

<script>
  export default {
    props: {
      data: Array
    }
  }
</script>
