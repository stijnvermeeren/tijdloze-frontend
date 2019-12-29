<template lang="pug">
  div
    h2 De Tijdloze Website
    .description
      template(v-if='listInProgress')
        | De #[strong Tijdloze van {{year.yyyy}}] wordt momenteel uitgezonden door #[a(href='https://stubru.be/') Studio Brussel].
        br
        | Op deze website kan je de lijst en alle bijhorende statistieken live volgen.
      template(v-else)
        | De #[strong Tijdloze] wordt uitgezonden door #[a(href='https://stubru.be/') Studio Brussel] op oudejaardsdag van 10:00 tot 20:00.
        br
        | Op deze website kan je de lijst en alle bijhorende statistieken live volgen.
    h3
      | De Tijdloze van {{year.yyyy}}
    table.lijst
      tbody
        tr
          th.n(v-if='year.previous()')
            nuxt-link(:to='`/lijst/${year.previous().yyyy}`') {{year.previous()._yy}}
          th.r
            nuxt-link(:to='`/lijst/${year.yyyy}`') {{year._yy}}
          th.a
            nuxt-link(to='/artiesten') Artiest
          th
            nuxt-link(to='/nummers') Titel
          th.releaseYear
            | Jaar
        tr(v-for='song in top5')
          td.n(v-if='year.previous()')
            tijdloze-position(:song='song' :year='year.previous()')
          td.r
            tijdloze-position-change(:song='song' :year='year')
            tijdloze-position(:song='song' :year='year')
          td.a
            tijdloze-song-artist(:song='song')
          td
            tijdloze-song(:song='song')
          td.releaseYear
            | {{song.album.releaseYear}}
    .link
      div
        nuxt-link(:to='`lijst/${year.yyyy}`') De volledige lijst van {{year.yyyy}}
      div
        nuxt-link(v-if='listInProgress' to='lijst/opkomst') Nog op komst...
      div
        nuxt-link(v-if='listInProgress && exitsKnown' :to='{ path: `lijst/${year.yyyy}`, hash: "#exits" }') Uit de lijst verdwenen...

    template(v-if="mode === 'chat'")
      h3 Chatbox
      div
        nuxt-link(to='chat') Ga naar de chatbox!

    template(v-if="showComments")
      h3
        | Reageer en discussieer
      .link
        nuxt-link(to='/reacties') Meer reacties / Schrijf zelf een reactie
      comment(v-for='comment in comments' :key='comment.id' :comment='comment')

    template(v-if='listInProgress')
      template(v-if='poll')
        h3 Poll
        div
          poll(:poll='poll')
        div
          nuxt-link(to='polls') Alle polls
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
      exitsKnown() {
        return this.$store.state.exitSongIds.length;
      },
      year() {
        return this.$store.getters.currentYear;
      },
      showComments() {
        return this.mode === 'comments' && !this.listInProgress;
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
        if (poll.year === store.getters.currentYear.yyyy) {
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
      if (this.showComments) {
        // refresh on client side to avoid a stale cache on the server-side
        const comments = await this.$axios.$get(`comments/1`);
        this.comments = _.take(comments, 5);
      }
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
    div {
      display: inline-block;
      margin: 0 20px;
    }
  }

  .releaseYear {
    @media (max-width: 660px) {
      display: none;
    }
  }
</style>
