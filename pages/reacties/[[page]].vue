<template lang="pug">
Title Reacties
div
  div.flexTitle
    h2 Reageer op de Tijdloze
    div(v-if="isAdmin")
      nuxt-link(to="/admin/comments")
        el-button(type="warning" round size="small") Admin: verwijderde reacties terugzetten
  comments-pager(:page='page' :pages='pages ')
  template(v-if='page === 1')
    template(v-if="!commentsOn")
      .message
        | Het plaatsen van reacties is niet mogelijk tijdens de uitzending van de Tijdloze.
    template(v-else)
      comments-form(:expanded="true" @submitted="onSubmitted" @displayNameChanged="onDisplayNameChanged")

  div
    comments-display(v-for='comment in comments' :key='comment.id' :comment='comment' @deleted="reload()")

  comments-pager(:page='page' :pages='pages ')
</template>

<script>
  import {useAuthStore} from "~/stores/auth";

  const commentsPerPage = 20;

  export default defineNuxtComponent({
    computed: {
      pages() {
        return Math.ceil(this.commentCount / commentsPerPage);
      },
      isAdmin() {
        return useAuthStore().isAdmin
      }
    },
    methods: {
      async reload() {
        const {data: comments} = await useApiFetch(`comments/${this.page}`);
        this.comments = comments
        const {data: commentCountResponse} = await useApiFetch(`comments/count`)
        this.commentCount = commentCountResponse.value.commentCount;
      },
      onDisplayNameChanged() {
        const page = useRoute().params.page || 1;
        const {data: comments} = useApiFetch(`comments/${page}`)
        this.comments = comments
      },
      onSubmitted() {
        const {data: comments} = useApiFetch(`comments/1`)
        useRouter().push('/reacties');
        this.comments = comments;
      }
    },
    async beforeRouteUpdate (to, from, next) {
      this.page = +to.query.page || 1;
      const {data: comments} = await useApiFetch(`comments/${this.page}`)
      this.comments = comments;
      next();
    },
    async asyncData() {
      const {data: commentsOnResponse} = await useApiFetch(`text/commentsOn`)
      const commentsOn = commentsOnResponse.value === 'on';

      const page = +useRoute().params.page || +useRoute().query.page || 1;
      const {data: comments} = await useApiFetch(`comments/${page}`)
      const {data: commentCountResponse} = await useApiFetch(`comments/count`)
      return {
        page,
        commentsOn,
        comments,
        commentCount: commentCountResponse.value.commentCount,
      };
    },
    async mounted() {
      // refresh on client side to avoid a stale cache on the server-side
      this.reload()
    },
    scrollToTop: true
  })
</script>
