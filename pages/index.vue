<template>
    <div>
        <h2>De Tijdloze Website</h2>

        <p style="text-align: center;">
            De <strong>Tijdloze van 2018</strong> wordt uitgezonden door Studio Brussel op <strong>31 december</strong>.<br />
            Op deze website komen er opnieuw live updates van alle statistieken.<br />
            <br />
            De technologie in de website werd volledig vernieuwd. Als er iets niet goed werkt, geef <nuxt-link to="/website/contact">dan een seintje</nuxt-link>.
        </p>

        <h3>
            De Tijdloze van {{year.yyyy}}
        </h3>
        <table class="lijst">
            <tbody>
            <tr>
                <th v-if="year.previous()" class="n">
                    <nuxt-link :to="`/lijst/${year.previous().yyyy}`">{{year.previous()._yy}}</nuxt-link>
                </th>
                <th class="r">{{year._yy}}</th>
                <th class="a">
                    <nuxt-link to="/artiesten">Artiest</nuxt-link>
                </th>
                <th>
                    <nuxt-link to="/nummers">Titel</nuxt-link>
                </th>
                <th class="releaseYear">
                    Jaar
                </th>
            </tr>
            <tr v-for="song in top5">
                <td v-if="year.previous()" class="n">
                    <tijdloze-position :song="song" :year="year.previous()" />
                </td>
                <td class="r">
                    <tijdloze-position-change :song="song" :year="year" />
                    <tijdloze-position :song="song" :year="year" />
                </td>
                <td class="a">
                    <tijdloze-artist :artist="song.artist" />
                </td>
                <td>
                    <tijdloze-song :song="song" />
                </td>
                <td class="releaseYear">
                    {{song.album.releaseYear}}
                </td>
            </tr>
            </tbody>
        </table>
        <div class="link">
            <nuxt-link :to="`lijst/${year.yyyy}`">Bekijk de volledige lijst van {{year.yyyy}}</nuxt-link>
        </div>

        <template v-if="!listInProgress">
            <h3>
                Reageer en discussieer
            </h3>

            <div class="link">
                <nuxt-link to="/reacties">Meer reacties / Schrijf zelf een reactie</nuxt-link>
            </div>

            <comment
              v-for="comment in comments"
              :key="comment.id"
              :comment="comment"
            />
        </template>
    </div>
</template>

<script>
    import _ from 'lodash';
    import Comment from '../components/comments/Comment'

    export default {
      components: {Comment},
      computed: {
        listInProgress() {
          return this.$store.getters.listInProgress;
        },
        top5() {
          return _.take(this.$store.getters.list(this.year), 5);
        },
        year() {
          return this.$store.getters.currentYear;
        }
      },
      async asyncData({ params, app }) {
        const comments = await app.$axios.$get(`comments/1`);
        return {
          comments: _.take(comments, 5)
        };
      },
      async mounted() {
        // refresh on client side in case of server-side caching
        const comments = await this.$axios.$get(`comments/1`);
        this.comments = _.take(comments, 5);
      }
    }
</script>

<style lang="less" scoped>
    @import "../assets/globalStyles.less";

    div.link {
        text-align: center;
    }

    .releaseYear {
        @media (max-width: 660px) {
            display: none;
        }
    }
</style>
