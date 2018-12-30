<template>
  <div>
    <h2>De Tijdloze chatbox</h2>
    <div v-if="isAuthenticated">
      <div v-if="displayName">
        <chat />
      </div>
      <div v-else>
        <div class="displayName">
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
              Naar de chatbox
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      Om toegang te krijgen tot de chatbox moet je je <a @click="login()">aanmelden/registeren</a>.
    </div>
  </div>
</template>

<script>
  import Chat from '../components/Chat'

  export default {
    components: { Chat },
    data() {
      return {
        name: this.$store.getters.displayName,
        submittingDisplayName: false
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
        return !this.name || this.name.length === 0;
      }
    },
    methods: {
      submitDisplayName() {
        this.submittingDisplayName = true;

        const data = {
          displayName: this.name
        };
        this.$axios.$post(`user/display-name`, data).then(user => {
          this.submittingDisplayName = false;
          this.$store.commit('setUser', user);
        });
      },
      login() {
        this.$auth.login(this.$route.path);
      }
    },
    head: {
      title: 'Chatbox'
    }
  }
</script>

<style lang="less" scoped>
    @import "~assets/globalStyles.less";

    div.displayName {
      padding: 0.3em 4em;
      margin: 1em 0;

      input {
        width: 150px;
      }

      div.info {
        font-size: 90%;
        font-style: italic;
      }
    }
</style>
