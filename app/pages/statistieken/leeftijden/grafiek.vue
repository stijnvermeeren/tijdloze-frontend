<template lang="pug">
div
  d3-ages-graph
  .legende
    ul
      li
        | Hoe breder het lijntje, hoe ouder het nummer, relatief met het jaar van de Tijdloze.
</template>

<style scoped>
  @import "../../../assets/styleConfig.css";

  div.legende {
    ul {
      margin: 0;
      padding: 0;
      max-width: 40em;
      margin: 0 auto;
      li {
        list-style-type: none;
        list-style-position: outside;
        text-align: left;
      }
      img {
        margin-right: 2em;
        vertical-align: bottom;
        border: var(--black-line);
        border-radius: var(--border-radius);
      }
    }
  }
</style>
