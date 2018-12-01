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
                        <button @click="submitDisplayName()" :disabled="submittingDisplayName">Ok</button>
                    </div>
                    <div v-if="editDisplayName">
                        De nieuwe gebruikersnaam wordt ook getoond bij alle berichten die je reeds met deze account geschreven hebt.
                    </div>
                </div>
                <div v-else>
                    <p v-if="error" class="fout">{{error}}}</p>
                    <p v-if="confirmation" class="goed">{{confirmation}}}</p>

                    <table>
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
                            <td><button @click="submit()" :disabled="submitting" class="formsubmit">Verzenden</button></td>
                        </tr>
                    </table>
                </div>
            </div>
            <div v-else>
                Om reacties the plaatsen, moet je je <a @click="login()">aanmelden/registeren</a>.
            </div>

            <h3>Alle reacties</h3>

            <div>
                <div v-for="comment in comments" class="reactie">
                    <div class="reacinfo">{{comment.name}} - {{comment.created}}</div>
                    <div class="bericht">{{comment.message}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { unsetAccessToken, login } from '~/utils/auth';

  export default {
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
      }
    },
    methods: {
      submitDisplayName() {
        this.submittingDisplayName = true;
        const data = {
          displayName: this.name
        };
        this.$axios.$post(`user/display-name`, data).then(user => {
          this.editDisplayName = false;
          this.submittingDisplayName = false;
          this.$store.commit('setUser', user);
        });
      },
      submit() {
        this.submitting = true;
        console.log("submitting");
      },
      login() {
        sessionStorage.setItem("redirectPath", this.$route.path);
        unsetAccessToken(this, this.$store);
        login();
      }
    },
    async asyncData({ params, app }) {
      const page = params.page || 1;
      return {
        comments: await app.$axios.$get(`comments/${page}`)
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

        &.groen {
            background-color: #b3f9a3;
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
