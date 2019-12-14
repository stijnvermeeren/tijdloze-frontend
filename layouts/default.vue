<template lang="pug">
  #container
    #header
      #logo(@click="$router.push('/')")
        h1 De Tijdloze Website
    #container2
      #left
      tijdloze-menu
      #maincontainer
        .hidden
          | De Tijdloze website bevat statistieken en informatie over de Tijdloze 100. Dit is de allertijden-lijst van Studio Brussel. Op het einde van elk jaar zend StuBru het beste uit de rockgeschiedenis uit. Op deze site vind je alle lijsten sinds 1987 en allerhande statistieken.
        #main
          #inhoud
            nuxt
        snackbar
      #right
</template>

<script>
  import Menu from '../components/Menu'
  import {secondsToExpiry} from '~/utils/jwt'
  import Snackbar from "../components/Snackbar";

  export default {
    components: {
      Snackbar,
      tijdlozeMenu: Menu
    },
    computed: {
      lastPosition() {
        return this.$store.getters.lastPosition
      }
    },
    mounted() {
      if (!this.$store.isAuthenticated) {
        const accessToken = this.$cookies.get('access_token');
        if (accessToken) {
          if (!this.$store.state.accessToken || secondsToExpiry(accessToken) < 0) {
            this.$auth.checkSession(
              error => {
                this.$auth.unsetAccessToken()
              },
              authResult => {
                this.$auth.loginCallback(authResult.idToken, authResult.accessToken)
              }
            )
          }
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../assets/globalStyles.less";

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
          background-color: @menuBackgroundColor;
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
    background-color: @headerBackgroundColor;

    #logo {
      display: block;
      background: url("/images/logo.png") no-repeat;
      background-position-x: 65px;
      overflow: hidden;
      margin: 0 auto;
      height: 90px;
      width: 480px;
      cursor: pointer;

      h1 {
        display: none;
      }
    }
  }
</style>
