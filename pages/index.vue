<template>
    <div>
        <h2>De Tijdloze Website</h2>

        <div class="description">
            <template v-if="listInProgress">
                De <strong>Tijdloze van 2018</strong> wordt momenteel uitgezonden door <a href="https://stubru.be/">Studio Brussel</a>.<br />
                Op deze website kan je de lijst en alle bijhorende statistieken live volgen.
            </template>
        </div>

        <h3>
            De Tijdloze van {{year.yyyy}}
        </h3>
        <table class="lijst">
            <tbody>
            <tr>
                <th v-if="year.previous()" class="n">
                    <nuxt-link :to="`/lijst/${year.previous().yyyy}`">{{year.previous()._yy}}</nuxt-link>
                </th>
                <th class="r">
                    <nuxt-link :to="`/lijst/${year.yyyy}`">{{year._yy}}</nuxt-link>
                </th>
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

        <template v-if="mode === 'chat'">
          <h3>Chatbox</h3>
          <div><nuxt-link to="chat">Ga naar de chatbox!</nuxt-link></div>
        </template>

        <template v-if="mode === 'comments' && !listInProgress">
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

        <template v-if="listInProgress">
            <template v-if="poll">
              <h3>Poll</h3>
              <div>
                  <poll :poll="poll" />
              </div>
              <div>
                <nuxt-link to="polls">Alle polls</nuxt-link>
              </div>
            </template>
        </template>
    </div>
</template>

<script>
    import _ from 'lodash';
    import Comment from '../components/comments/Comment'
    import Poll from "../components/Poll";

    export default {
      components: {Poll, Comment},
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
      async asyncData({ params, app, store }) {
        const modeResponse = await app.$axios.$get(`text/mode`);

        let comments = [];
        if (!store.getters.listInProgress && modeResponse.value === 'comments') {
          comments = await app.$axios.$get(`comments/1`);
        }

        let latestPoll = undefined;
        if (store.getters.listInProgress) {
          const poll = await app.$axios.$get('poll/latest');
          if (poll.year === 2018) {
            latestPoll = poll;
          }
        }

        return {
          poll: latestPoll,
          mode: modeResponse.value,
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

    div.description {
        text-align: center;
    }

    div.link {
        text-align: center;
    }

    .releaseYear {
        @media (max-width: 660px) {
            display: none;
        }
    }
</style>
