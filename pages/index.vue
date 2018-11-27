<template>
    <div>
        <h2>De Tijdloze Website</h2>

        <div class="notabs">

            <p style="text-align: center;">
                <tijdloze-links text="[*Black] van [Pearl Jam] staat voor het derde jaar op de eerste plaats van de Tijdloze." /><br />
                <tijdloze-links text="[Mia] gaat weer voorbij aan [Smells Like Teen Spirit] naar de tweede plek." /><br />
                <tijdloze-links text="[Bohemian Rhapsody] en [Wish You Were Here] zorgen voor meer verandering in de top vijf." /><br />
                <tijdloze-links text="[Africa] is de hoogste nieuwkomer, [In The End] is de grootste stijger." /><br />
                <nuxt-link to="/lijst/2017">Bekijk de volledige lijst van 2017</nuxt-link>
            </p>
        </div>


        <div class="kolommen">

            <div class="linkerkant main">
                <table class="lijst home">
                    <tbody>
                        <tr>
                            <th colspan="2">
                                <nuxt-link :to="`lijst/${year.yyyy}`">Tijdloze {{year.yyyy}}</nuxt-link>

                            </th>
                        </tr>
                        <tr v-for="song in top20" :class="{lineAfter: song.position(year) % 5 === 0}">
                            <td class="a">
                                <tijdloze-position :song="song" :year="year" />
                            </td>
                            <td>
                                <tijdloze-artist :artist="song.artist" /> - <tijdloze-song :song="song" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="rechterkant main">
                <h3><nuxt-link to="/reacties">Reageer en discussieer</nuxt-link></h3>
                <div v-for="comment in comments" class="reactie">
                    <div class="reacinfo">{{comment.name}} - {{comment.created}}</div>
                    <div class="bericht">{{comment.message}}</div>
                </div>
            </div>

            <br clear="both" />
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
      props: ["coreData"],
      data() {
        return {
          year: this.$store.getters.currentYear
        }
      },
      computed: {
        top20() {
          return _.take(this.$store.getters.list(this.year), 20);
        }
      },
      async asyncData({ params, app }) {
        const comments = await app.$axios.$get(`comments/1`)
        return {
          comments: _.take(comments, 5)
        };
      }
    }
</script>

<style lang="less" scoped>
    @import "../assets/globalStyles.less";

    div.kolommen {
        margin-top: 1.7em;
    }
    div.linkerkant {
        width: 45%;
        float: left;
        td {
            white-space: normal;
        }
    }
    div.main table {
        border: @blackLine;

        td {
            padding-top: 0.2em;
            padding-bottom: 0.2em;
        }
    }
    div.rechterkant {
        width: 52%;
        float: right;
    }
    div.rechterkant.main {
        background-color: @inputBackgroundColor;
        border: @blackLine;

        ul.commentary {
            font-size: 90%;
            li {
                line-height: 1.2em;
                margin-bottom: 0.5em;
            }
        }
    }
    div.main ul {
        margin-right: 2em;
    }
    div.main h4 {
        margin-left: 1em;
        padding-left: 1em;
        margin-right: 1em;
        padding-right: 1em;
        padding-top: 0.5em;
        border-top: 1px solid brown;
    }

    div.kolommen h3 {
        font-size: 120%;
        text-align: center;
        background-color: @headerBackgroundColor;
        margin-top: 0;
    }

    div.reactie {
        border: none;
        padding: 0.3em 2em;
        margin: 1em 0;

        div.reacinfo {
            font-size: 90%;
            margin: 0.2em 0 0.4em 0;
            font-weight: bold;
            border-bottom: @blackLine;

            span {
                font-weight: bold;
            }
        }

        div.bericht {
            white-space: pre-wrap;
        }
    }
</style>
