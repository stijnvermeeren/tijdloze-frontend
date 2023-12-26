<template lang="pug">
div
  .description
    ui-alert.alert(v-if="listInProgress")
      | De Tijdloze is een radioprogramma van Studio Brussel. Officiële informatie vind je op de website #[a(href='https://www.vrt.be/vrtmax/kanalen/de-tijdloze/') VRT MAX].
      br
      | De Tijdloze van {{year.yyyy}} wordt momenteel uitgezonden. Op deze website kan je de lijst en alle bijhorende statistieken volgen (regelmatige updates tijdens de countdown; live tijdens de top 100).

    ui-alert(v-else title="Officiële informatie / stemmen")
      | De Tijdloze is een radioprogramma van #[a(href='https://stubru.be/') StuBru]. Voor officiële informatie en de mogelijkheid om te stemmen (meestal eind november / begin december) moet je op de website #[a(href='https://www.vrt.be/vrtmax/kanalen/de-tijdloze/') VRT MAX] zijn.
  ui-card(v-if="tableYear" :title="`De Tijdloze van ${tableYear.yyyy}`")
    template(v-if="top5.length")
      song-with-position(v-for='song in top5' :key='song.id' :song='song' :year="tableYear")
    p(v-else) Nog geen nummers in de Tijdloze van {{year.tableYear}}.
    .link
      nuxt-link(v-if='top5.length' :to='`/lijst/${tableYear.yyyy}`')
        v-btn De volledige lijst van {{tableYear.yyyy}}
      nuxt-link(v-if='listInProgress' to='/lijst/opkomst')
        v-btn Nog op komst
      nuxt-link(v-if='listInProgress && exitsKnown' :to='{ path: `/lijst/${tableYear.yyyy}/exits` }')
        v-btn Uit de top 100 verdwenen

  ui-card(v-if="chatOn" title="Chatbox")
    div.link
      nuxt-link(to="/chat")
        v-btn Ga naar de chatbox!

  ui-card(v-if="commentsOn" title="Reageer en discussieer")
    comments-form(@submitted="reloadComments" @displayNameChanged="reloadComments")
    comments-display(v-for='comment in comments' :key='comment.id' :comment='comment')
    .link
      nuxt-link(to='/reacties')
        v-btn Meer reacties

  ui-card(v-if='listInProgress && poll' title="Poll")
    div
      poll(:poll='poll')
    div.link
      nuxt-link(to='/polls')
        v-btn Alle polls
</template>

<script>
  import _ from 'lodash';
  import {useRootStore} from "~/stores/root";
  import {usePollStore} from "~/stores/poll";
  import List from "~/orm/List";
  import {useRepo} from "pinia-orm";
  import Song from "~/orm/Song";

  export default defineNuxtComponent({
    computed: {
      listInProgress() {
        return useRootStore().listInProgress;
      },
      poll() {
        return usePollStore().currentPoll;
      },
      top5() {
        const list = _.take(useRepo(List).find(this.tableYear?.yyyy).songIds, 5)
        const songs = list.map(songId => {
          return useRepo(Song).find(songId)
        })
        useRepo(Song).withAll().load(songs)
        return songs
      },
      exitsKnown() {
        return !! useRootStore().listTop100(this.tableYear?.previous).find(song => {
          return song.notInList(this.tableYear);
        })
      },
      year() {
        return useRootStore().currentYear;
      },
      tableYear() {
        if (useRepo(List).find(this.year.yyyy)?.songIds?.length === 0 && this.year?.previous) {
          return this.year.previous;
        } else {
          return this.year;
        }
      }
    },
    methods: {
      async reloadComments() {
        const {data} = await useApiFetch(`comments/1`);
        this.comments = _.take(data.value, 5);
      }
    },
    async asyncData() {
      const [{data: chatOnResponse}, {data: commentsOnResponse}] = await Promise.all([
        useApiFetch(`text/chatOn`),
        useApiFetch(`text/commentsOn`)
      ])
      const chatOn = chatOnResponse.value.value === 'on';
      const commentsOn = commentsOnResponse.value.value === 'on';

      let comments = [];
      if (commentsOn) {
        const {data} = await useApiFetch(`comments/1`);
        comments = _.take(data.value, 5);
      }

      return {
        chatOn,
        commentsOn,
        comments
      };
    },
    async mounted() {
      if (this.commentsOn) {
        // I'm not sure why nextTick is needed, but I'm not the first one to run into this:
        // https://stackoverflow.com/questions/71609027
        // Maybe the root issue is this: https://github.com/nuxt/nuxt/issues/13471
        await nextTick(async () => {
          // refresh on client side to avoid a stale cache on the server-side
          const {data} = await useApiFetch(`comments/1`);
          if (data.value) {
            this.comments = _.take(data.value, 5);
          }
        })
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
