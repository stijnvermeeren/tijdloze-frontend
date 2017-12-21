<template>
    <TijdlozeStationaryGraph :songs="songs" />
</template>

<script>
  import StationaryGraph from "../../../components/d3/StationaryGraph"

  export default {
    components: {
      TijdlozeStationaryGraph: StationaryGraph
    },
    computed: {
      songs() {
        return this.$store.getters.songs;
      }
    }
  }
</script>
