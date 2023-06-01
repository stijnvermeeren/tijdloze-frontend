<template lang="pug">
tijdloze-stationary-graph(:songs='songs')
</template>

<script>
  import StationaryGraph from "../../../components/d3/StationaryGraph"
  import {useRootStore} from "~/stores/root";

  export default {
    components: {
      TijdlozeStationaryGraph: StationaryGraph
    },
    computed: {
      songs() {
        return useRootStore().songs;
      }
    }
  }
</script>
