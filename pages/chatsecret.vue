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
          v-text-field(:disabled='submittingDisplayName' type='text' v-model='name' @keypress.enter='submitDisplayName()' hide-details)
          v-btn(:disabled='submittingDisplayName || invalidDisplayName' @click='submitDisplayName()')
            | Naar de chatbox
  div(v-else)
    | Om toegang te krijgen tot de chatbox moet je je #[a(@click='login()') aanmelden/registeren].
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
      async submitDisplayName() {
        this.submittingDisplayName = true;

        const data = {
          displayName: this.name
        };
        const {data: user} = await useApiFetchPost(`user/display-name`, data)
        this.submittingDisplayName = false;
        useAuthStore().setUser(user.value);
      },
      login() {
        this.$auth.login(useRoute().path);
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
