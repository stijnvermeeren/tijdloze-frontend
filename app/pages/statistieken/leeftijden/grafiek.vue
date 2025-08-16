<template lang="pug">
div
  d3-ages-graph
  .legende
    ul
      li
        | Hoe breder het lijntje, hoe ouder het nummer, relatief met het jaar van de Tijdloze.
</template>

<style lang="scss" scoped>
  @use "../../../assets/styleConfig";

  div.legende {
    ul {
      @include styleConfig.noBullets;
      max-width: 40em;
      margin: 0 auto;
      li {
        text-align: left;
      }
      img {
        margin-right: 2em;
        vertical-align: bottom;
        @include styleConfig.border;
      }
    }
  }
</style>
