<template>
    <div>
        <h2>Statistieken</h2>

        <div class="kolommen statistiekenmenu">
            <div class="linkerkant">
                <h4>Verschuivingen</h4>
                <ul>
                    <li><nuxt-link to="/statistieken/nieuwkomers">Nieuwkomers</nuxt-link></li>
                    <li><nuxt-link to="/statistieken/reentries">Re-entries</nuxt-link></li>
                    <li><nuxt-link to="/statistieken/exits">Exits</nuxt-link></li>
                    <li><nuxt-link to="/statistieken/eenjaarsvliegen">Eenjaarsvliegen</nuxt-link></li>
                    <li><nuxt-link to="/statistieken/stijgers">Stijgers</nuxt-link></li>
                    <li><nuxt-link to="/statistieken/dalers">Dalers</nuxt-link></li>
                    <li><nuxt-link to="/statistieken/stationair">Stationaire nummers</nuxt-link></li>
                </ul>
            </div>
            <div class="rechterkant">
                <h4>Andere statistieken</h4>
                <ul>
                    <li><nuxt-link to="/statistieken/noteringen">Noteringen</nuxt-link></li>
                    <li><nuxt-link to="/statistieken/noteringen_album">Noteringen (Albums)</nuxt-link></li>
                    <li><nuxt-link to="/statistieken/landen">Landen</nuxt-link></li>
                    <li><nuxt-link to="/statistieken/talen">Talen</nuxt-link></li>
                    <li><nuxt-link to="/statistieken/decennia">Decennia</nuxt-link></li>
                    <li><nuxt-link to="/statistieken/leeftijden">Leeftijden</nuxt-link></li>
                </ul>
            </div>
        </div>
    </div>
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
