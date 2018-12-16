<template>
    <div id="container">
        <tijdloze-menu />

        <div id="header">
            <div id="logo"><h1><nuxt-link to="/"><span>Tijdloze Website</span></nuxt-link></h1></div>
        </div>
        <div id="maincontainer">
            <div class="hidden">De Tijdloze website bevat statistieken en informatie over de Tijdloze 100. Dit is de allertijden-lijst van Studio Brussel. Op het einde van elk jaar zend StuBru het beste uit de rockgeschiedenis uit. Op deze site vind je alle lijsten sinds 1987 en allerhande statistieken.</div>
            <div id="main">
                <div id="inhoud">
                    <nuxt />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Menu from '../components/Menu'
  import {secondsToExpiry} from '~/utils/jwt'

  export default {
    components: {
      tijdlozeMenu: Menu
    },
    computed: {
      lastPosition() {
        return this.$store.getters.lastPosition
      }
    },
    watch: {
      lastPosition() {
        this.$store.dispatch('setRefreshInterval');
      }
    },
    mounted() {
      if (process.client && !this.$store.state.refreshInterval) {
        this.$store.dispatch('setRefreshInterval');
      }

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
    }

    #maincontainer {
        position: relative;

        @media (min-width: 1200px) {
            margin-left: 300px;
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
    }
    #logo {
        h1 {
            display: block;
            background: url("/images/logo.png") no-repeat;
            text-align: center;
            overflow: hidden;
            margin: 0 auto;
            max-width: 640px;

            a {
                display: block;
                .logoDimensions;
                overflow: hidden;
            }
            span {
                display: none;
            }
        }
    }
</style>
