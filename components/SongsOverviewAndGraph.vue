<template>
    <div>
        <tijdloze-songs-overview
                :songs="songs"
                :hoverIndex="hoverIndex"
                @hover="onHover"
        />

        <tijdloze-graph
                v-if="songs.find(song => song.listCount($store.getters.years) > 0)"
                :songs="songs"
                :hoverIndex="hoverIndex"
                @hover="onHover"
        />
    </div>
</template>

<script>
  import Graph from "./d3/Graph";
  import SongsOverview from "./SongsOverview";

  export default {
    components: {
      TijdlozeSongsOverview: SongsOverview,
      TijdlozeGraph: Graph
    },
    props: ['songs'],
    data() {
      return {
        hoverIndex: null
      }
    },
    methods: {
      onHover(index) {
        this.hoverIndex = index;
      }
    }
  }
</script>
