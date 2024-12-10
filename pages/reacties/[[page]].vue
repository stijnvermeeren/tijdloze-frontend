<template lang="pug">
Title Reacties
div
  div.flexTitle
    h2 Reageer op de Tijdloze
    ui-admin-link-btn(to="/admin/comments") Admin: verwijderde reacties terugzetten
  comments-pager(:page='page' :pages='pages ')
  template(v-if='page === 1')
    template(v-if="!commentsOn")
      .message
        | Het plaatsen van reacties is niet mogelijk tijdens de uitzending van de Tijdloze.
    template(v-else)
      comments-form(:expanded="true" @submitted="onSubmitted" @displayNameChanged="onDisplayNameChanged")

  div
    comments-display(v-for='comment in comments' :key='comment.id' :comment='comment' @deleted="reload()")

  comments-pager(:page='page' :pages='pages')
</template>

<script setup>
  import useClientDataRefresh from "~/composables/useClientDataRefresh";

  const commentsPerPage = 20;

  const {data: commentsOn} = await useFetch(
    `text/commentsOn`,
    useFetchOpts({transform: data => data.value === 'on'})
  )

  const {data: commentCount, refresh: reloadCommentCount} = await useFetch(
    `comments/count`,
    useFetchOpts({transform: data => data.commentCount})
  )

  const page = computed(() => {
    return +useRoute().params.page || +useRoute().query.page || 1;
  })

  const {data: comments, refresh: refreshComments} = await useFetch(
    `comments/${page.value}`,
    useFetchOpts()
  )
  useClientDataRefresh(refreshComments)

  const pages = computed(() => {
    return Math.ceil(commentCount.value / commentsPerPage);
  })

  async function reload() {
    await reloadComments()
    await reloadCommentCount()
  }

  async function onDisplayNameChanged() {
    await reloadComments()
  }

  async function onSubmitted() {
    await reloadComments()
    navigateTo('/reacties');
  }

  definePageMeta({
    scrollToTop: true
  })
</script>
