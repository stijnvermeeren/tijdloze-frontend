<template>
    <div>
        <h2>Reageer op de Tijdloze</h2>

        <div class="notabs">
            <div v-if="isAuthenticated">
                <h3>Plaats een nieuwe reactie</h3>

                <div v-if="!displayName || editDisplayName">
                    <div>
                        Kies een gebruikersnaam:
                        <input v-model="name" :disabled="submittingDisplayName" type="text" class="formtext" />
                        <button @click="submitDisplayName()" :disabled="submittingDisplayName || invalidDisplayName">Ok</button>
                    </div>
                    <div v-if="editDisplayName">
                        De nieuwe gebruikersnaam wordt ook getoond bij alle berichten die je reeds met deze account geschreven hebt.
                    </div>
                </div>
                <div v-else>
                    <p v-if="error" class="fout">{{error}}}</p>
                    <p v-if="confirmation" class="goed">{{confirmation}}}</p>

                    <table>
                        <tbody>
                            <tr>
                                <td class="formlabel">Naam:</td>
                                <td>{{displayName}} (<a @click="editDisplayName = true">Aanpassen</a>)</td>
                            </tr>
                            <tr>
                                <td class="formlabel">Bericht:</td>
                                <td><textarea v-model="message" :disabled="submitting" cols="30" rows="4" ></textarea></td>
                            </tr>
                            <tr>
                                <td class="formlabel">&nbsp;</td>
                                <td><button @click="submit()" :disabled="submitting || invalidMessage" class="formsubmit">Verzenden</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else>
                Om reacties the plaatsen, moet je je <a @click="login()">aanmelden/registeren</a>.
            </div>

            <h3>Alle reacties</h3>

            <comments-pager :page="page" :pages="pages "/>

            <div>
                <div v-for="comment in comments" :class="['reactie', {'mine': isMine(comment)}]">
                    <div class="reacinfo">{{comment.name}} - {{comment.created}}</div>
                    <div class="bericht">{{comment.message}}</div>
                </div>
            </div>

            <comments-pager :page="page" :pages="pages "/>
        </div>
    </div>
</template>

<script>
  import { unsetAccessToken, login } from '~/utils/auth';
  import CommentsPager from '../components/comments/CommentsPager'

  const commentsPerPage = 20;

  export default {
    components: {CommentsPager},
    data() {
      return {
        name: this.$store.getters.displayNameWithFallback,
        message: "",
        error: undefined,
        confirmation: undefined,
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
      },
      isMine(comment) {
        return this.isAuthenticated && this.$store.state.user.id === comment.userId;
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
      title: 'De Tijdloze Tijdloze'
    }
  }
</script>

<style lang="less" scoped>
    @import "../assets/globalStyles.less";

    div.reactie {
        border: @blackLine;
        padding: 0.3em 4em;
        margin: 1em 0;

        &.mine {
            background-color: @headerBackgroundColor;
        }

        div.reacinfo {
            font-size: 90%;
            margin: 0.2em 0 0.4em 0;
            font-weight: bold;
            border-bottom: @blackLine;

            span {
                font-weight: bold;
            }
        }

        div.bericht {
            white-space: pre-wrap;
        }
    }
</style>
