<template lang="pug">
Title Chatbox
div
  h2 De Tijdloze chatbox {{chatEnabled}} {{skipSettingsCheck}}
  template(v-if='chatEnabled || skipSettingsCheck')
    div(v-if='isAuthenticated')
      div(v-if='displayName')
        chat
        ui-alert.mt-4
          div Hou het spannend voor iedereen alsjeblieft. Wie in de chat informatie lekt over noteringen in de Tijdloze die nog niet op de radio zijn uitgezonden, kan onmiddellijk en zonder waarschuwing geblokkeerd worden.
      div(v-else)
        .displayName
          div
            | Kies een gebruikersnaam:
            v-text-field(:disabled='submittingDisplayName' type='text' v-model='name' @keypress.enter='submitDisplayName()' hide-details)
            v-btn(:disabled='submittingDisplayName || invalidDisplayName' @click='submitDisplayName()')
              | Naar de chatbox
    div(v-else)
      | Om toegang te krijgen tot de chatbox moet je je #[nuxt-link(:to="{path: '/auth/login', query: {redirect: route.fullPath}}") aanmelden/registeren].
  template(v-else)
    div Sorry, de chatbox is (nog) niet toegankelijk op dit moment. Probeer later nog eens.
</template>

<script>
  import {useAuthStore} from "~/stores/auth";

  export default defineNuxtComponent({
    data() {
      return {
        name: useAuthStore().displayName,
        submittingDisplayName: false
      }
    },
    computed: {
      route() {
        return useRoute()
      },
      isAuthenticated() {
        return useAuthStore().isAuthenticated;
      },
      displayName() {
        return useAuthStore().displayName;
      },
      invalidDisplayName() {
        return !this.name || this.name.length === 0;
      },
      skipSettingsCheck() {
        return 'skipSettingsCheck' in useRoute().query
      }
    },
    methods: {
      async submitDisplayName() {
        this.submittingDisplayName = true;

        const data = {
          displayName: this.name
        };
        const user = await this.$api(`user/display-name`, useFetchOptsPost(data))
        this.submittingDisplayName = false;
        useAuthStore().setUser(user);
      },
      login() {
        this.$auth.login(useRoute().path);
      }
    },
    async asyncData({$api}) {
      const modeResponse = await $api(`text/chatOn`);
      return {
        chatEnabled: modeResponse.value === 'on'
      }
    }
  })
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
