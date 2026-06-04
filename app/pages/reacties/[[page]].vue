<template lang="pug">
Title Reacties
div
  div.flexTitle
    h2 Reageer op de Tijdloze
    ui-admin-link-btn(to="/admin/comments") Admin: verwijderde reacties terugzetten
  template(v-if="paginationReady")
    comments-pager(:page='page' :pages='pages ')
    template(v-if='page === 1')
      template(v-if="!commentsOn")
        .message
          | Het plaatsen van reacties is niet mogelijk tijdens de uitzending van de Tijdloze.
      template(v-else)
        comments-form.form(:expanded="true" @submitted="onSubmitted" @displayNameChanged="onDisplayNameChanged")

    div(v-if="commentsReady")
      comments-thread(v-for='thread in comments' :key='thread.mainComment.id' :thread-summary='thread' @updated="reload")
    div(v-else)
      v-progress-circular(indeterminate)

    comments-pager(:page='page' :pages='pages')
  div(v-else)
    v-progress-circular(indeterminate)
</template>

<script setup lang="ts">
  import type { TextValueResponse } from '~/api/contracts'
  import { apiEndpoints } from '~/api/endpoints'
  import { textKey } from '~/api/endpoints/text'
  import { queryKeys } from '~/api/queryKeys'
  import useClientDataRefresh from "~/composables/useClientDataRefresh";

  const commentsPerPage = 20;

  const {data: commentsOn, status: status1} = await useApiFetch(
    apiEndpoints.text.byKey(textKey.commentsOn),
    {transform: (data: TextValueResponse) => data.value === 'on', key: queryKeys.text.commentsOn, lazy: true}
  )

  const {data: commentCount, refresh: reloadCommentCount, status: status2} = await useApiFetch(
    apiEndpoints.comment.count(),
    {key: queryKeys.comments.count, lazy: true}
  )

  const page = computed(() => {
    const paramsPage = useRouteParam('page')
    const queryPage = useRouteQueryParam('page')
    return +(paramsPage || queryPage || 1)
  })

  const {data: comments, refresh: refreshComments, status: status3} = await useApiFetch(
    () => apiEndpoints.comment.list(page.value), { lazy: true }
  )
  useClientDataRefresh(refreshComments)

  const paginationReady = computed(() => {
    return status1.value === 'success' && status2.value === 'success'
  })
  const commentsReady = computed(() => {
    return paginationReady.value && status3.value === 'success'
  })

  const pages = computed(() => {
    return Math.ceil((commentCount.value?.commentCount ?? 0) / commentsPerPage);
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
    key: 'reacties'  // avoid re-rendering the whole page when just switching comments page
  })
</script>

<style scoped>
.form {
  max-width: 780px;
  margin: 1em auto 2em;
}
</style>
