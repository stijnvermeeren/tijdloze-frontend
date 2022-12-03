<template lang="pug">
  div
    h2 De Tijdloze chatbox
    template(v-if='chatEnabled')
      div(v-if='isAuthenticated')
        div(v-if='displayName')
          chat
            .note
              em
                | Hou het spannend voor iedereen alsjeblieft. Wie in de chat informatie lekt over noteringen in de Tijdloze die nog niet op de radio zijn uitgezonden, kan onmiddellijk en zonder waarschuwing geblokkeerd worden.
        div(v-else)
          .displayName
            div
              | Kies een gebruikersnaam:
              input(:disabled='submittingDisplayName' type='text' v-model='name' @keypress.enter='submitDisplayName()')
              button(:disabled='submittingDisplayName || invalidDisplayName' @click='submitDisplayName()')
                | Naar de chatbox
      div(v-else)
        | Om toegang te krijgen tot de chatbox moet je je #[a(@click='login()') aanmelden/registeren].
    template(v-else)
      div Sorry, de chatbox is (nog) niet toegankelijk op dit moment. Probeer later nog eens.
</template>

<script>
  import Chat from '../components/Chat'

  export default {
    components: { Chat },
    data() {
      return {
        name: this.$store.getters['auth/displayName'],
        submittingDisplayName: false
      }
    },
    computed: {
      isAuthenticated() {
        return this.$store.getters['auth/isAuthenticated'];
      },
      displayName() {
        return this.$store.getters['auth/displayName'];
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
          this.$store.commit('auth/setUser', user);
        });
      },
      login() {
        this.$auth.login(this.$route.path);
      }
    },
    async asyncData({ app }) {
      const modeResponse = await app.$axios.$get(`text/chatOn`);
      return {
        chatEnabled: modeResponse.value === 'on'
      }
    },
    head: {
      title: 'Chatbox'
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
