<template lang="pug">
  div
    h2 Reageer op de Tijdloze
    comments-pager(:page='page' :pages='pages ')
    template(v-if='page === 1')
      template(v-if="mode !== 'comments'")
        .message
          | Het plaatsen van reacties is niet mogelijk tijdens de uitzending van de Tijdloze.
      template(v-else)
        comment-form(:expanded="true" @submitted="onSubmitted" @displayNameChanged="onDisplayNameChanged")

    div
      comment(v-for='comment in comments' :key='comment.id' :comment='comment')

    comments-pager(:page='page' :pages='pages ')
</template>

<script>
  import CommentsPager from '~/components/comments/CommentsPager'
  import CommentForm from '~/components/comments/CommentForm'
  import Comment from '~/components/comments/Comment'

  const commentsPerPage = 20;

  export default {
    components: {Comment, CommentsPager, CommentForm},
    computed: {
      pages() {
        return Math.ceil(this.commentCount / commentsPerPage);
      }
    },
    methods: {
      onDisplayNameChanged() {
        const page = this.$route.params.page || 1;
        this.$axios.$get(`comments/${page}`).then(comments => {
          this.comments = comments;
        });
      },
      onSubmitted() {
        this.$axios.$get(`comments/1`).then(comments => {
          this.$router.push('/reacties');
          this.comments = comments;
        });
      }
    },
    beforeRouteUpdate (to, from, next) {
      this.page = +to.query.page || 1;
      this.$axios.$get(`comments/${this.page}`).then(comments => {
        this.comments = comments;
        next();
      });
    },
    async asyncData({ route, app, params }) {
      const modeResponse = await app.$axios.$get(`text/mode`);

      const page = +params.page || +route.query.page || 1;
      return {
        page: page,
        mode: modeResponse.value,
        comments: await app.$axios.$get(`comments/${page}`),
        commentCount: (await app.$axios.$get(`comments/count`)).commentCount,
      };
    },
    async mounted() {
      // refresh on client side to avoid a stale cache on the server-side
      this.comments = await this.$axios.$get(`comments/${this.page}`);
      this.commentCount = (await this.$axios.$get(`comments/count`)).commentCount;
    },
    head: {
      title: 'Reacties'
    },
    scrollToTop: true
  }
</script>
