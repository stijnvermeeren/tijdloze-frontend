<template lang="pug">
#container
  #header
    #burgerButtonContainer
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
    #right
  snackbar
</template>

<script setup>
import useSetUser from "~/composables/useSetUser";
import {useAuth0} from "@auth0/auth0-vue";

onMounted(async () => {
  const auth0 = useAuth0()
  watch(auth0.user, () => useSetUser(auth0), { immediate: true })
  await auth0.checkSession()
})
</script>

<style lang="scss">
  @use "../assets/globalStyles";
  @use "../assets/styleConfig";

  html {
    height: 100%;
  }

  body {
    width: 100%;
    min-width: 480px;
    min-height: 100%;

    #__nuxt {
      height: 100%;
    }
  }

  .router-link-active{
    cursor: auto;
    color: #000;
    &:hover {
      color: #000;
    }
  }

  .v-btn {
    text-transform: unset !important;
    letter-spacing: unset !important;
  }

  p, ul {
    &:not(:last-child) {
      margin-bottom: 0.8em;
    }
  }

  ul {
    margin-left: 2em;
  }

  #container {
    position: relative;
    min-width: 480px;
    width: 100%;

    display: flex;
    flex-flow: column;
    min-height: 100%;

    #container2 {
      flex: 1 1 auto;

      @media (min-width: 800px) {
        display: flex;
        justify-content: center;
        align-items: stretch;

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
    max-width: 840px;

    @media (min-width: 1200px) {
      padding: 10px 30px 20px 30px;
    }
  }

  #header {
    flex: 0 1 auto;
    background-color: styleConfig.$headerBackgroundColor;

    #logo {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-top: 8px;
      height: 68px;
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
