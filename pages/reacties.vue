<template lang="pug">
  div
    h2 Reageer op de Tijdloze
    comments-pager(:page='page' :pages='pages ')
    template(v-if='page === 1')
      template(v-if='listInProgress')
        .message
          | Het plaatsen van reacties is niet mogelijk tijdens de uitzending van de Tijdloze.
      template(v-else)
        div(v-if='isAuthenticated')
          .displayName(v-if='!displayName || editDisplayName')
            div
              | Kies een gebruikersnaam:
              input(:disabled='submittingDisplayName' type='text' v-model='name')
              button(:disabled='submittingDisplayName || invalidDisplayName' @click='submitDisplayName()')
                | Ok
            .info(v-if='editDisplayName')
              | De nieuwe gebruikersnaam wordt ook getoond bij alle berichten die je reeds met deze account geschreven hebt.
          div(v-else)
            div
              .reactie.mine
                .reacinfo
                  | {{ displayName }} (
                  a(@click='editDisplayName = true') Gebruikersnaam aanpassen
                  | )
                .bericht
                  textarea(:disabled='submitting' cols='60' placeholder='Schrijf een nieuwe reactie...' rows='4' v-model='message')
                div
                  button.formsubmit(:disabled='submitting || invalidMessage' @click='submit()')
                    | Verzenden
        .message(v-if='!isAuthenticated')
          | Om reacties the plaatsen, moet je je #[a(@click='login()') aanmelden/registeren].

    div
      comment(v-for='comment in comments' :key='comment.id' :comment='comment')

    comments-pager(:page='page' :pages='pages ')
</template>

<script>
  import CommentsPager from '../components/comments/CommentsPager'
  import Comment from '../components/comments/Comment'

  const commentsPerPage = 20;

  export default {
    components: {Comment, CommentsPager},
    data() {
      return {
        name: this.$store.getters['auth/displayNameWithFallback'],
        message: "",
        editDisplayName: false,
        submittingDisplayName: false,
        submitting: false,
      }
    },
    computed: {
      listInProgress() {
        return this.$store.getters.listInProgress;
      },
      isAuthenticated() {
        return this.$store.getters['auth/isAuthenticated'];
      },
      displayName() {
        return this.$store.getters['auth/displayName'];
      },
      invalidDisplayName() {
        return this.name.length === 0;
      },
      invalidMessage() {
        return this.message.length === 0;
      },
      pages() {
        return Math.ceil(this.commentCount / commentsPerPage);
      }
    },
    methods: {
      submitDisplayName() {
        this.submittingDisplayName = true;

        const data = {
          displayName: this.name
        };
        this.$axios.$post(`user/display-name`, data).then(user => {
          const page = this.$route.params.page || 1;
          this.$axios.$get(`comments/${page}`).then(comments => {
            this.comments = comments;

            this.editDisplayName = false;
            this.submittingDisplayName = false;
            this.$store.commit('auth/setUser', user);
          });
        });
      },
      submit() {
        this.submitting = true;

        const data = {
          message: this.message
        };
        this.$axios.$post(`comment`, data).then(response => {
          this.$axios.$get(`comments/1`).then(comments => {
            this.$router.push('/reacties');
            this.comments = comments;
            this.submitting = false;
            this.message = '';
          })
        });
      },
      login() {
        this.$auth.login(this.$route.path);
      }
    },
    beforeRouteUpdate (to, from, next) {
      this.page = +to.query.page || 1;
      this.$axios.$get(`comments/${this.page}`).then(comments => {
        this.comments = comments;
        next();
      });
    },
    async asyncData({ route, app }) {
      const page = +route.query.page || 1;
      return {
        page: page,
        comments: await app.$axios.$get(`comments/${page}`),
        commentCount: (await app.$axios.$get(`comments/count`)).commentCount,
      };
    },
    async mounted() {
      // refresh on client side in case of server-side caching
      this.comments = await this.$axios.$get(`comments/${this.page}`);
      this.commentCount = (await this.$axios.$get(`comments/count`)).commentCount;
    },
    head: {
      title: 'Reacties'
    }
  }
</script>

<style lang="less" scoped>
    @import "~assets/globalStyles.less";

    div.message {
      font-style: italic;
      margin: 10px 0;
    }

    div.displayName {
        padding: 0.3em 4em;
        margin: 1em 0;

        div.info {
            font-size: 90%;
            font-style: italic;
        }
    }

    div.reactie {
      padding: 0.3em 4em;
      margin: 1em 0;

      &.mine {
        div.reacinfo {
          background-color: @headerBackgroundColor;
        }
      }

      div.reacinfo {
        background-color: #ccc;
        font-size: 90%;
        padding: 0.1em 0.2em;
        margin: 0.2em 0 0.4em 0;
        font-weight: bold;
        border-bottom: @blackLine;

        span {
          font-weight: bold;
        }
      }

      div.bericht {
        white-space: pre-wrap;
        overflow: auto;

        textarea {
          width: 100%;
          box-sizing: border-box;
          height: 5em;
          font-size: 14px;
          padding: 2px 4px;
        }
      }

      button {
        font-size: 14px;
      }
    }
</style>
