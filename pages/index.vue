<template lang="pug">
  div
    h2 De Tijdloze Website
    .description
      template(v-if="listInProgress")
        | De #[strong Tijdloze 100] wordt momenteel uitgezonden door #[a(href='https://stubru.be/') Studio Brussel].
        br
        | Op deze website kan je de lijst en alle bijhorende statistieken live volgen.
      template(v-else)
        | De Tijdloze Website is nu volledig #[em open source]. Hulp bij het verbeteren van de layout en de functionaliteiten is steeds welkom. Zie #[strong #[nuxt-link(to='website/opensource') open source]] voor meer info.
    el-card
      div.header(slot="header")
        div.title De Tijdloze van {{tableYear.yyyy}}
      table.lijst(v-if="top5.length")
        tbody
          tr
            th.n(v-if='tableYear.previous()')
              nuxt-link(:to='`/lijst/${tableYear.previous().yyyy}`') {{tableYear.previous()._yy}}
            th.r
              nuxt-link(:to='`/lijst/${tableYear.yyyy}`') {{tableYear._yy}}
            th.a Artiest
            th Titel
            th.releaseYear
              | Jaar
          tr(v-for='song in top5')
            td.n(v-if='tableYear.previous()')
              tijdloze-position(:song='song' :year='tableYear.previous()')
            td.r
              tijdloze-position-change(:song='song' :year='tableYear')
              tijdloze-position(:song='song' :year='tableYear')
            td.a
              tijdloze-song-artist(:song='song')
            td
              tijdloze-song(:song='song')
            td.releaseYear
              | {{song.album.releaseYear}}
      p(v-else) Nog geen nummers in de Tijdloze van {{year.tableYear}}.
      .link
        nuxt-link(v-if='top5.length' :to='`lijst/${tableYear.yyyy}`')
          el-button De volledige lijst van {{tableYear.yyyy}}
        nuxt-link(v-if='listInProgress' to='lijst/opkomst')
          el-button Nog op komst...
        nuxt-link(v-if='listInProgress && exitsKnown' :to='{ path: `lijst/${year.yyyy}`, hash: "#exits" }')
          el-button Uit de lijst verdwenen...

    el-card(v-if="chatOn")
      div.header(slot="header")
        div.title Chatbox
      div
        nuxt-link(to="/chat")
          el-button Ga naar de chatbox!

    el-card(v-if="commentsOn")
      div.header(slot="header")
        div.title Reageer en discussieer
      comment-form(@submitted="reloadComments" @displayNameChanged="reloadComments")
      comment(v-for='comment in comments' :key='comment.id' :comment='comment')
      .link
        nuxt-link(to='/reacties')
          el-button Meer reacties

    el-card(v-if='listInProgress && poll')
      div.header(slot="header")
        div.title Poll
      div
        poll(:poll='poll')
      div
        nuxt-link(to='/polls')
          el-button Alle polls
</template>

<script>
  import _ from 'lodash';
  import Comment from '../components/comments/Comment'
  import CommentForm from '~/components/comments/CommentForm'
  import Poll from "../components/Poll";

  export default {
    components: {Poll, Comment, CommentForm},
    computed: {
      listInProgress() {
        return this.$store.getters.listInProgress;
      },
      top5() {
        return _.take(this.$store.getters.list(this.tableYear, true), 5);
      },
      exitsKnown() {
        // TODO create getter in store
        return this.$store.getters.songs.filter(song => {
          return song.position(this.year.previous()) && song.notInList(this.year);
        }).length > 0
      },
      year() {
        return this.$store.getters.currentYear;
      },
      tableYear() {
        if (this.$store.getters.list(this.year, true).length === 0 && this.year.previous()) {
          return this.year.previous();
        } else {
          return this.year;
        }
      }
    },
    methods: {
      async reloadComments() {
        const comments = await this.$axios.$get(`comments/1`);
        this.comments = _.take(comments, 5);
      }
    },
    async asyncData({ params, app, store }) {
      const chatOn = (await app.$axios.$get(`text/chatOn`)).value === 'on';
      const commentsOn = (await app.$axios.$get(`text/commentsOn`)).value === 'on';

      let comments = [];
      if (commentsOn) {
        comments = await app.$axios.$get(`comments/1`);
        comments = _.take(comments, 5);
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
        chatOn,
        commentsOn,
        comments: comments
      };
    },
    async mounted() {
      if (this.mode === 'comments') {
        // refresh on client side to avoid a stale cache on the server-side
        const comments = await this.$axios.$get(`comments/1`);
        this.comments = _.take(comments, 5);
      }
    }
  }
</script>

<style lang="scss" scoped>
  div.description {
    text-align: center;
  }

  div.link {
    text-align: center;
    margin-top: 20px;
    button {
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
