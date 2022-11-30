<template lang="pug">
  tijdloze-distribution-graph(:points='data')
</template>

<script>
  import DistributionGraph from "../../../components/d3/DistributionGraph"

  export default {
    components: {
      TijdlozeDistributionGraph: DistributionGraph
    },
    props: {
      data: Array
    }
  }
</script>
