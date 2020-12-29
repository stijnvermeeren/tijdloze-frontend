<template lang="pug">
  div
    h2 De Tijdloze Website
    .description
      template(v-if="introMode === 'during'")
        | De #[strong Tijdloze van {{year.yyyy}}] wordt momenteel uitgezonden door #[a(href='https://stubru.be/') Studio Brussel].
        br
        | Op deze website kan je de lijst en alle bijhorende statistieken live volgen.
      template(v-if="introMode === 'pre'")
        | De #[strong Tijdloze] wordt uitgezonden door #[a(href='https://stubru.be/') Studio Brussel] op oudejaardsdag van 10:00 tot 20:00.
        br
        | Op deze website kan je de lijst en alle bijhorende statistieken live volgen.
      template(v-if="introMode == 'none'")
        | De Tijdloze Website is nu volledig #[em open source]. Hulp bij het verbeteren van de layout en de functionaliteiten is steeds welkom. Zie #[strong #[nuxt-link(to='website/opensource') open source]] voor meer info.
    h3
      | De Tijdloze van {{year.yyyy}}
    table.lijst(v-if="top5.length")
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
    p(v-else) Nog geen nummers in de Tijdloze van {{year.yyyy}}.
    .link
      div
        nuxt-link(v-if='top5.length' :to='`lijst/${year.yyyy}`') De volledige lijst van {{year.yyyy}}
      div
        nuxt-link(v-if='listInProgress' to='lijst/opkomst') Nog op komst...
      div
        nuxt-link(v-if='listInProgress && exitsKnown' :to='{ path: `lijst/${year.yyyy}`, hash: "#exits" }') Uit de lijst verdwenen...

    template(v-if="mode === 'chat'")
      h3 Chatbox
      div
        nuxt-link(to='chat') Ga naar de chatbox!

    template(v-if="mode === 'comments'")
      h3
        | Reageer en discussieer
      comment-form(@submitted="reloadComments" @displayNameChanged="reloadComments")
      comment(v-for='comment in comments' :key='comment.id' :comment='comment')
      .link
        nuxt-link(to='/reacties') Meer reacties

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
  import CommentForm from '~/components/comments/CommentForm'
  import Poll from "../components/Poll";

  export default {
    components: {Poll, Comment, CommentForm},
    computed: {
      listInProgress() {
        return this.$store.getters.listInProgress;
      },
      top5() {
        return _.take(this.$store.getters.list(this.year, true), 5);
      },
      exitsKnown() {
        // TODO create getter in store
        return this.$store.getters.songs.filter(song => {
          return song.position(this.year.previous()) && song.notInList(this.year);
        }).length > 0
      },
      year() {
        return this.$store.getters.currentYear;
      }
    },
    methods: {
      async reloadComments() {
        const comments = await this.$axios.$get(`comments/1`);
        this.comments = _.take(comments, 5);
      }
    },
    async asyncData({ params, app, store }) {
      const modeResponse = await app.$axios.$get(`text/mode`);
      const introResponse = await app.$axios.$get(`text/intro`);

      let comments = [];
      if (modeResponse.value === 'comments') {
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
        mode: modeResponse.value,
        introMode: introResponse.value,
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
