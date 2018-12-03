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

  export default {
    components: {
      tijdlozeMenu: Menu
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
        padding: 1em 2em 2em 2em;
        margin: 0 auto;
        max-width: 66em;
    }

    #header {
        background-color: @headerBackgroundColor;
    }
    #logo {
        h1 {
            display: block;
            background: url("/images/logo.png") no-repeat;
            .logoDimensions;
            margin: 0 auto;

            a {
                display: block;
                .logoDimensions;
            }
            span {
                display: none;
            }
        }
    }
</style>
