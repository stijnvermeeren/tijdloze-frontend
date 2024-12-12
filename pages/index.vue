<template lang="pug">
div
  .description
    ui-alert.alert(v-if="listInProgress")
      | De Tijdloze is een radioprogramma van Studio Brussel. Officiële informatie vind je op de website #[a(href='https://www.vrt.be/vrtmax/kanalen/de-tijdloze/') VRT MAX].
      br
      | De Tijdloze van {{year.yyyy}} wordt momenteel uitgezonden. Op deze website kan je de lijst en alle bijhorende statistieken volgen (regelmatige updates tijdens de countdown; live tijdens de top 100).

    ui-alert(v-else title="Officiële informatie / stemmen")
      | De Tijdloze is een radioprogramma van #[a(href='https://stubru.be/') Studio Brussel]. Dit is een onafhankelijke website. Officiële informatie en de mogelijkheid om te stemmen (ca. eind november / begin december) vind je op de website #[a(href='https://www.vrt.be/vrtmax/kanalen/de-tijdloze/') VRT MAX].
  ui-card(v-if="tableYear" :title="`De Tijdloze van ${tableYear.yyyy}`")
    template(v-if="top5.length")
      song-with-position(v-for='song in top5' :key='song.id' :song='song' :year="tableYear" hide-previous-next)
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
    comments-form(@submitted="refreshComments" @displayNameChanged="refreshComments")
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

<script setup>
  import _ from 'lodash';
  import {useRootStore} from "~/stores/root";
  import {usePollStore} from "~/stores/poll";
  import List from "~/orm/List";
  import {useRepo} from "pinia-orm";
  import Song from "~/orm/Song";
  import useClientDataRefresh from "~/composables/useClientDataRefresh";

  const listInProgress = computed(() => {
    return useRootStore().listInProgress;
  })

  const poll = computed(() => {
    return usePollStore().currentPoll;
  })

  const year = computed(() => {
    return useRootStore().currentYear;
  })

  const tableYear = computed(() => {
    if (year.value) {
      if (useRepo(List).find(year.value.yyyy)?.songIds?.length === 0 && year.value?.previous) {
        return year.value.previous;
      } else {
        return year.value;
      }
    }
  })

  const top5 = computed(() => {
    const list = useRepo(List).find(tableYear.value?.yyyy)
    if (list) {
      const songs = _.take(list.songIds, 5).map(songId => {
        return useRepo(Song).find(songId)
      })
      useRepo(Song).withAll().load(songs)
      return songs
    } else {
      return []
    }
  })

  const exitsKnown = computed(() => {
    return !! useRootStore().listTop100(tableYear.value?.previous).find(song => {
      return song.notInList(tableYear.value);
    })
  })

  const {data: chatOn} = await useFetch(
    `text/chatOn`,
    useFetchOpts({transform: data => data.value === 'on', key: 'text/chatOn'})
  )
  const {data: commentsOn} = await useFetch(
    `text/commentsOn`,
    useFetchOpts({transform: data => data.value === 'on', key: 'text/commentsOn'})
  )

  const {data: comments, execute: refreshComments} = await useAsyncData(
    'comments',
    () => {
      if (commentsOn.value) {
        return $fetch(
            `comments/1`,
            useFetchOpts({transform: data => _.take(data, 5)})
        )
      } else {
        return Promise.resolve([])
      }
    },
    {watch: [commentsOn]}
  )
  useClientDataRefresh(refreshComments)
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
