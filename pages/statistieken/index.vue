<template lang="pug">
  div
    h2 Statistieken
    .kolommen.statistiekenmenu
      .linkerkant
        h4 Verschuivingen
        ul
          li
            nuxt-link(to='/statistieken/nieuwkomers') Nieuwkomers
          li
            nuxt-link(to='/statistieken/reentries') Re-entries
          li
            nuxt-link(to='/statistieken/exits') Exits
          li
            nuxt-link(to='/statistieken/eenjaarsvliegen') Eenjaarsvliegen
          li
            nuxt-link(to='/statistieken/stijgers') Stijgers
          li
            nuxt-link(to='/statistieken/dalers') Dalers
          li
            nuxt-link(to='/statistieken/stationair') Stationaire nummers
      .rechterkant
        h4 Andere statistieken
        ul
          li
            nuxt-link(to='/statistieken/noteringen') Noteringen
          li
            nuxt-link(to='/statistieken/noteringen_album') Noteringen (Albums)
          li
            nuxt-link(to='/statistieken/landen') Landen
          li
            nuxt-link(to='/statistieken/talen') Talen
          li
            nuxt-link(to='/statistieken/leadvocals') Lead vocals
          li
            nuxt-link(to='/statistieken/decennia') Decennia
          li
            nuxt-link(to='/statistieken/leeftijden') Leeftijden
</template>

<script>
  export default {
    head: {
      title: 'Statistieken'
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/globalStyles.less";

  .statistiekenmenu {
    h4 {
      font-size: 130%;
      margin-bottom: 0.7em;
    }
    ul {
      .noBullets;
      li {
        font-size: 130%;
        margin-bottom: 0.5em;
      }
    }
  }

  div.kolommen {
    margin-top: 1.7em;

    div.linkerkant {
      width: 50%;
      float: left;
    }
    div.rechterkant {
      width: 50%;
      float: right;
    }
  }
</style>
