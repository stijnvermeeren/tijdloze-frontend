<template lang="pug">
Title Reacties
div
  div.flexTitle
    h2 Reageer op de Tijdloze
    ui-admin-link-btn(to="/admin/comments") Admin: verwijderde reacties terugzetten
  tempate(v-if="paginationReady")
    comments-pager(:page='page' :pages='pages ')
    template(v-if='page === 1')
      template(v-if="!commentsOn")
        .message
          | Het plaatsen van reacties is niet mogelijk tijdens de uitzending van de Tijdloze.
      template(v-else)
        comments-form(:expanded="true" @submitted="onSubmitted" @displayNameChanged="onDisplayNameChanged")

    div(v-if="commentsReady")
      comments-display(v-for='comment in comments' :key='comment.id' :comment='comment' @deleted="reload()")
    div(v-else)
      v-progress-circular(indeterminate)

    comments-pager(:page='page' :pages='pages')
  div(v-else)
    v-progress-circular(indeterminate)
</template>

<script setup>
  import useClientDataRefresh from "~/composables/useClientDataRefresh";

  const commentsPerPage = 20;

  const {data: commentsOn, status: status1} = await useLazyFetch(
    `text/commentsOn`,
    useFetchOpts({transform: data => data.value === 'on', key: 'commentsOn}'})
  )

  const {data: commentCount, refresh: reloadCommentCount, status: status2} = await useLazyFetch(
    `comments/count`,
    useFetchOpts({transform: data => data.commentCount, key: `comments/count`})
  )

  const page = computed(() => {
    return +useRoute().params.page || +useRoute().query.page || 1;
  })

  const commentsApiUrl = computed(() => `comments/${page.value}`)
  const {data: comments, refresh: refreshComments, status: status3} = await useLazyFetch(
    commentsApiUrl, useFetchOpts({key: commentsApiUrl})
  )
  useClientDataRefresh(refreshComments)

  const paginationReady = computed(() => {
    return status1.value === 'success' && status2.value === 'success'
  })
  const commentsReady = computed(() => {
    return paginationReady.value && status3.value === 'success'
  })

  const pages = computed(() => {
    return Math.ceil(commentCount.value / commentsPerPage);
  })

  async function reload() {
    await refreshComments()
    await reloadCommentCount()
  }

  async function onDisplayNameChanged() {
    await refreshComments()
  }

  async function onSubmitted() {
    await refreshComments()
    navigateTo('/reacties');
  }

  definePageMeta({
    scrollToTop: true,
    key: "reacties"  // avoid re-rendering the whole page when just switching comments page
  })
</script>
