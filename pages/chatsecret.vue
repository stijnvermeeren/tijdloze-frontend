<template lang="pug">
Title Chatbox
div
  h2 De Tijdloze chatbox
  div(v-if='isAuthenticated')
    div(v-if='displayName')
      chat
    div(v-else)
      .displayName
        div
          | Kies een gebruikersnaam:
          input(:disabled='submittingDisplayName' type='text' v-model='name' @keypress.enter='submitDisplayName()')
          button(:disabled='submittingDisplayName || invalidDisplayName' @click='submitDisplayName()')
            | Naar de chatbox
  div(v-else)
    | Om toegang te krijgen tot de chatbox moet je je #[a(@click='login()') aanmelden/registeren].
</template>

<script>
  import Chat from '../components/Chat'
  import {useAuthStore} from "~/stores/auth";

  export default {
    components: { Chat },
    data() {
      return {
        name: useAuthStore().displayName,
        submittingDisplayName: false
      }
    },
    computed: {
      isAuthenticated() {
        return useAuthStore().isAuthenticated;
      },
      displayName() {
        return useAuthStore().displayName;
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
          useAuthStore().setUser(user);
        });
      },
      login() {
        this.$auth.login(useRoute().path);
      }
    }
  }
</script>

<style lang="scss" scoped>
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

  div.note {
    font-size: 14px;
    margin: 10px 0;
  }
</style>
