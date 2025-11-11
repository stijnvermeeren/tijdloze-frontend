<template lang="pug">
div
  .description
    ui-alert.alert(v-if="listInProgress")
      | De Tijdloze is een radioprogramma van Studio Brussel. Officiële informatie vind je op de website #[a(href='https://www.vrt.be/vrtmax/kanalen/de-tijdloze/') VRT MAX].
      br
      | De Tijdloze van {{currentYear.yyyy}} wordt momenteel uitgezonden. Op deze website kan je de lijst en alle bijhorende statistieken volgen (regelmatige updates tijdens de countdown; live tijdens de top 100).

    ui-alert(v-else title="Officiële informatie / stemmen")
      | De Tijdloze is een radioprogramma van #[a(href='https://stubru.be/') Studio Brussel]. Dit is een onafhankelijke website. Officiële informatie en de mogelijkheid om te stemmen (ca. eind november / begin december) vind je op de website #[a(href='https://www.vrt.be/vrtmax/kanalen/de-tijdloze/') VRT MAX].
  ui-card(v-if="tableYear" :title="`De Tijdloze van ${tableYear.yyyy}`")
    template(v-if="top5.length")
      song-with-position(
        v-for='{position, song, attribution} in top5'
        :key='position'
        :song='song'
        :attribution="attribution"
        :override-position="position"
        :year="tableYear"
        hide-previous-next
      )
    p(v-else) Nog geen nummers in de Tijdloze van {{tableYear.yyyy}}.
    .link
      nuxt-link(v-if='top5.length' :to='`/lijst/${tableYear.yyyy}`')
        v-btn De volledige lijst van {{tableYear.yyyy}}
      nuxt-link(v-if='listInProgress && lastPosition <= 1000' :to='`/lijst/${tableYear.yyyy}/opkomst`')
        v-btn Nog op komst?
      nuxt-link(v-if='listInProgress && exitsKnown' :to='`/lijst/${tableYear.yyyy}/exits`')
        v-btn Uit de top 100 verdwenen

  ui-card(v-if="chatOn" title="Chatbox")
    div.link
      nuxt-link(to="/chat")
        v-btn Ga naar de chatbox!

  ui-card(v-if="commentsOn" title="Reageer en discussieer")
    comments-form.commentForm(@submitted="refreshComments" @displayNameChanged="refreshComments")
    comments-thread(v-for='thread in comments' :key='thread.mainComment.id' :thread-summary='thread' @updated="refreshComments")
    .link
      nuxt-link(to='/reacties')
        v-btn Meer reacties

  ui-card(v-if='listInProgress && currentPoll' title="Poll")
    div
      poll(:poll='currentPoll')
    div.link
      nuxt-link(to='/polls')
        v-btn Alle polls
</template>

<script setup>
import List from "~/orm/List";
import {useRepo} from "pinia-orm";
import useClientDataRefresh from "~/composables/useClientDataRefresh";

const {$api} = useNuxtApp()

const {lastPosition, listInProgress} = storeToRefs(useRootStore())
const {currentYear, previousYear, context} = storeToRefs(useYearStore())
const { currentPoll } = storeToRefs(usePollStore())

const tableYear = computed(() => {
  if (currentYear.value) {
    if (useRepo(List).find(currentYear.value.yyyy)?.songIds?.length === 0 && previousYear.value) {
      return previousYear.value;
    } else {
      return currentYear.value;
    }
  }
})
const yearBeforeTableYear = computed(() => {
  return context.value.forYear(tableYear.value).previous?.year
})

const top5 = computed(() => {
  const list = useRootStore().list(tableYear.value, 5)
  if (list) {
    return list
  } else {
    return []
  }
})

const exitsKnown = computed(() => {
  return !! useRootStore().list(yearBeforeTableYear.value)
      .filter(entry => entry.position <= 100)
      .find(entry => entry.song.notInList(tableYear.value))
})

const {data: chatOn, status: chatStatus} = await useLazyFetch(
  `text/chatOn`,
  useFetchOpts({transform: data => data.value === 'on', key: 'text/chatOn'})
)

const {data: commentsOn, status: commentsStatus1} = await useLazyFetch(
  `text/commentsOn`,
  useFetchOpts({transform: data => data.value === 'on', key: 'text/commentsOn'})
)

const {data: comments, execute: refreshComments, status: commentsStatus2} = await useLazyAsyncData(
  'comments',
  () => {
    if (commentsOn.value) {
      return $api(`comments/1`).then(data => data.slice(0, 6))
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

  .commentForm {
    max-width: 780px;
    margin: 1em auto 2em;
  }
</style>
