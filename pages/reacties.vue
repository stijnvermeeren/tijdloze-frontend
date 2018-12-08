<template>
  <div>
    <h2>Reageer op de Tijdloze</h2>

    <CommentsPager
      :page="page"
      :pages="pages "
    />

    <div v-if="isAuthenticated && page === 1">
      <div
        class="displayName"
        v-if="!displayName || editDisplayName"
      >
        <div>
          Kies een gebruikersnaam:
          <input
            :disabled="submittingDisplayName"
            type="text"
            v-model="name"
          >
          <button
            :disabled="submittingDisplayName || invalidDisplayName"
            @click="submitDisplayName()"
          >
            Ok
          </button>
        </div>
        <div
          class="info"
          v-if="editDisplayName"
        >
          De nieuwe gebruikersnaam wordt ook getoond bij alle berichten die je reeds met deze account geschreven hebt.
        </div>
      </div>
      <div v-else>
        <div>
          <div class="reactie mine">
            <div class="reacinfo">
              {{ displayName }} (<a @click="editDisplayName = true">
                Gebruikersnaam aanpassen
              </a>)
            </div>
            <div class="bericht">
              <textarea
                :disabled="submitting"
                cols="60"
                placeholder="Schrijf een nieuwe reactie..."
                rows="4"
                v-model="message"
              />
            </div>
            <div>
              <button
                :disabled="submitting || invalidMessage"
                @click="submit()"
                class="formsubmit"
              >
                Verzenden
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isAuthenticated && page === 1">
      Om reacties the plaatsen, moet je je <a @click="login()">aanmelden/registeren</a>.
    </div>

    <div>
      <comment
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      />
    </div>

    <CommentsPager
      :page="page"
      :pages="pages "
    />
  </div>
</template>

<script>
  import { unsetAccessToken, login } from '~/utils/auth';
  import CommentsPager from '../components/comments/CommentsPager'
  import Comment from '../components/comments/Comment'

  const commentsPerPage = 20;

  export default {
    components: {Comment, CommentsPager},
    data() {
      return {
        name: this.$store.getters.displayNameWithFallback,
        message: "",
        editDisplayName: false,
        submittingDisplayName: false,
        submitting: false,
      }
    },
    computed: {
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      },
      displayName() {
        return this.$store.getters.displayName;
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
            this.$store.commit('setUser', user);
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
        sessionStorage.setItem("redirectPath", this.$route.path);
        unsetAccessToken(this, this.$store);
        login();
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
    head: {
      title: 'Reacties'
    }
  }
</script>

<style lang="less" scoped>
    @import "~assets/globalStyles.less";

    div.displayName {
        padding: 0.3em 4em;
        margin: 1em 0;

        div.info {
            font-size: 90%;
            font-style: italic;
        }
    }
</style>
