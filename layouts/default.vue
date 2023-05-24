<template lang="pug">
#container
  #header
    #logo(@click="$router.push('/')")
      h1 tijdloze
        span.domain .rocks
      div.subtitle Tijdloze muziek-klassiekers + data-analyse
  #container2
    #left
    site-menu
    #maincontainer
      .hidden
        | tijdloze.rocks bevat statistieken en informatie over de Tijdloze 100. Dit is de allertijden-lijst van Studio Brussel. Op het einde van elk jaar zend StuBru het beste uit de rockgeschiedenis uit. Op deze site vind je alle lijsten sinds 1987 en allerhande statistieken.
      #main
        #inhoud
          slot
      snackbar
    #right
</template>

<script>
  import 'element-plus/theme-chalk/index.css';

  export default defineNuxtComponent({
    mounted() {
      this.$auth.loginSilently()
    }
  })
</script>

<style lang="scss">
  @use "../assets/globalStyles";
  @use "../assets/styleConfig";

  #container {
    position: relative;

    #container2 {
      @media (min-width: 800px) {
        display: flex;
        justify-content: center;
        align-items: stretch;
        overflow: auto;

        #maincontainer {
          flex-grow: 1;
        }
      }

      @media (min-width: 1200px) {
        #left {
          background-color: styleConfig.$menuBackgroundColor;
          flex-grow: 1;
        }
        #maincontainer {
          width: 900px;
          flex-grow: 0;
        }
        #right {
          flex-grow: 2;
        }
      }
    }
  }

  #main {
    box-sizing: border-box;
    padding: 10px 10px 20px 10px;
    margin: 0 auto;
    min-width: 480px;
    max-width: 840px;

    @media (min-width: 1200px) {
      padding: 10px 30px 20px 30px;
    }
  }

  #header {
    background-color: styleConfig.$headerBackgroundColor;

    #logo {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-top: 8px;
      height: 60px;
      cursor: pointer;
      text-align: center;

      h1 {
        margin: 0 20px;
        font-size: 32px;
        font-style: italic;

        .domain {
          font-size: 20px;
        }
      }

      .subtitle {
        margin: 0 20px;
        font-size: 12px;
        color: #444;
      }
    }
  }
</style>
