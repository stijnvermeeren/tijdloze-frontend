<template lang="pug">
div
  .description
    el-alert.alert(v-if="listInProgress" :closable="false" show-icon)
      | De #[strong Tijdloze] van {{year.yyyy}} wordt momenteel uitgezonden door #[a(href='https://stubru.be/') StuBru].
      br
      | Op deze website kan je de lijst en alle bijhorende statistieken volgen.

    el-alert.alert(v-else title="Officiële informatie / stemmen" :closable="false" show-icon)
      | De Tijdloze is een radioprogramma van #[a(href='https://stubru.be/') StuBru]. Voor officiële informatie en de mogelijkheid om te stemmen (meestal eind november / begin december) moet je #[a(href='https://stubru.be/rubriek/de-tijdloze/') op de website van StuBru] zijn.
  el-card(v-if="tableYear")
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
            position(:song='song' :year='tableYear.previous()')
          td.r
            position-change(:song='song' :year='tableYear')
            position(:song='song' :year='tableYear')
          td.a
            song-artist-link(:song='song')
          td
            song-link(:song='song')
          td.releaseYear
            | {{song.album.releaseYear}}
    p(v-else) Nog geen nummers in de Tijdloze van {{year.tableYear}}.
    .link
      nuxt-link(v-if='top5.length' :to='`lijst/${tableYear.yyyy}`')
        el-button De volledige lijst van {{tableYear.yyyy}}
      nuxt-link(v-if='listInProgress' to='lijst/opkomst')
        el-button Nog op komst...
      nuxt-link(v-if='listInProgress && exitsKnown' :to='{ path: `lijst/${tableYear.yyyy}`, hash: "#exits" }')
        el-button Uit de lijst verdwenen...

  el-card(v-if="chatOn")
    div.header(slot="header")
      div.title Chatbox
    div.link
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
    div.link
      nuxt-link(to='/polls')
        el-button Alle polls
</template>

<script>
  import _ from 'lodash';
  import Comment from '../components/comments/Comment'
  import CommentForm from '~/components/comments/CommentForm'
  import {useRootStore} from "~/stores/root";
  import {usePollStore} from "~/stores/poll";

  export default defineNuxtComponent({
    components: {Comment, CommentForm},
    computed: {
      listInProgress() {
        return useRootStore().listInProgress;
      },
      poll() {
        return usePollStore().currentPoll;
      },
      top5() {
        return _.take(useRootStore().list(this.tableYear), 5);
      },
      exitsKnown() {
        // TODO create getter in store
        return useRootStore().songs.filter(song => {
          return song.position(this.year?.previous()) && song.notInList(this.year);
        }).length > 0
      },
      year() {
        return useRootStore().currentYear;
      },
      tableYear() {
        if (useRootStore().list(this.year).length === 0 && this.year?.previous()) {
          return this.year.previous();
        } else {
          return this.year;
        }
      }
    },
    methods: {
      async reloadComments() {
        const comments = await useApiFetch(`comments/1`);
        this.comments = _.take(comments, 5);
      }
    },
    async asyncData() {
      const [{data: chatOnResponse}, {data: commentsOnResponse}] = await Promise.all([
        useApiFetch(`text/chatOn`),
        useApiFetch(`text/commentsOn`)
      ])
      const chatOn = chatOnResponse.value === 'on';
      const commentsOn = commentsOnResponse.value === 'on';

      let comments = [];
      if (commentsOn) {
        comments = await useApiFetch(`comments/1`);
        comments = _.take(comments, 5);
      }

      return {
        chatOn,
        commentsOn,
        comments: comments
      };
    },
    async mounted() {
      if (this.commentsOn) {
        // refresh on client side to avoid a stale cache on the server-side
        const comments = await useApiFetch(`comments/1`);
        this.comments = _.take(comments, 5);
      }
    }
  })
</script>

<style lang="scss" scoped>
  div.description {
    margin-top: 20px;
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
