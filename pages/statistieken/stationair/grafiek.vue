<template lang="pug">
d3-stationary-graph(:songs='songs')
</template>

<script>
  import {useRootStore} from "~/stores/root";

  export default {
    computed: {
      songs() {
        return useRootStore().songs;
      }
    }
  }
</script>
