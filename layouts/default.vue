<template>
    <div id="container">
        <div id="maincontainer">
            <div id="header">
                <div id="logo"><h1><nuxt-link to="/home"><span>Tijdloze Website</span></nuxt-link></h1></div>
                <!-- <div id="searchBox"><input type="text" data-ajax-url="{path route='/search'}?query=%QUERY" placeholder="Zoek artiest, album of nummer..." /></div> -->
                <div id="menu">
                    <ul>
                        <li><nuxt-link to="/">Home</nuxt-link></li>
                        <li><nuxt-link to="/artiesten">Artiesten en nummers</nuxt-link></li>
                        <li><nuxt-link to="/tijdlozetijdloze">De Tijdloze Tijdloze</nuxt-link></li>
                        <li><nuxt-link to="/statistieken">Statistieken</nuxt-link></li>
                        <li><nuxt-link to="/website">Over deze website</nuxt-link></li>
                    </ul>
                </div>
                <div id="tijdlijn">
                    <ul>
                        <li class="detijdlozevan"><nuxt-link to="/lijsten">De Tijdloze van...</nuxt-link></li>

                        <li v-for="year in [...years].reverse()"><nuxt-link :to="'/lijst/' + year.yyyy">{{year._yy}}</nuxt-link></li>
                    </ul>
                </div>
            </div>

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
  export default {
    computed: {
      years() {
        return this.$store.getters.years;
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

    /* MENU */
    #menu, #tijdlijn {
        border-top: @blackLine;
        padding: 0.2em 0;
        line-height: 1.4em;
        text-align: center;

        a {
            padding: 0.2em 0;
            font-weight: bold;
            color: @menuLinkColor;
        }

        ul {
            .noBullets;
            display: inline;
            li {
                display: inline;
                background-color: inherit;
                margin: 0.2em 0.9em;
                padding: 0.2em 0;
            }
        }
    }

    #menu {
        background-color: @menuBackgroundColor;
        font-size: 110%;
    }

    #tijdlijn {
        border-bottom: @blackLine;
        font-size: 90%;

        ul {
            li {
                margin: 0.2em 0.4em;
            }
            li.detijdlozevan a {
                font-weight: normal;
            }
        }
    }
</style>
