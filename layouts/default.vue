<template>
    <div id="container">
        <div id="header">
            <div id="logo" @click="$router.push('/')"><h1>De Tijdloze Website</h1></div>
        </div>
        <div id="container2">
            <div id="left"></div>
            <tijdloze-menu />

            <div id="maincontainer">
                <div class="hidden">De Tijdloze website bevat statistieken en informatie over de Tijdloze 100. Dit is de allertijden-lijst van Studio Brussel. Op het einde van elk jaar zend StuBru het beste uit de rockgeschiedenis uit. Op deze site vind je alle lijsten sinds 1987 en allerhande statistieken.</div>
                <div id="main">
                    <div id="inhoud">
                        <nuxt />
                    </div>
                </div>
            </div>
            <div id="right"></div>
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

        #container2 {
            display: flex;
            justify-content: center;
            align-items: stretch;

            #maincontainer {
                flex-grow: 1;
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
                    flex-grow: 1;
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
