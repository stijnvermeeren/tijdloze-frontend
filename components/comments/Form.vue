<template lang="pug">
div.commentForm(:class="{expanded: isExpanded}")
  div(v-if='isAuthenticated')
    .displayName(v-if='!displayName || editingDisplayName')
      div.d-flex
        v-text-field.mr-4(:disabled='submittingDisplayName' v-model='name' label="Kies een gebruikersnaam" hide-details)
        v-btn(:disabled='submittingDisplayName || invalidDisplayName' @click='submitDisplayName()')
          | Ok
      div.changeDisplayNameInfo(v-if='editingDisplayName')
        | De nieuwe gebruikersnaam wordt ook getoond bij alle berichten die je reeds met deze account geschreven hebt.
    div(v-else)
      div
        div.commentHeader(v-if="isExpanded")
          span.name {{ displayName }}
          span.changeName
            | (
            a(@click='editDisplayName') Gebruikersnaam aanpassen
            | )
        div
          v-textarea(
            :disabled='submitting'
            label='Schrijf een nieuwe reactie...'
            :rows='isExpanded ? 4 : 1'
            v-model='message'
            @click.once="onFocus($event)"
            hide-details
          )
        div(v-if="isExpanded")
          v-btn.formsubmit(:disabled='submitting || invalidMessage' @click='submit()')
            | Verzenden
  .message(v-if='!isAuthenticated')
    | Om reacties the plaatsen, moet je je #[nuxt-link(:to="{path: '/auth/login', query: {redirect: route.fullPath}}") aanmelden/registeren].
</template>

<script>
  import {useAuthStore} from "~/stores/auth";

  export default {
    props: {
      "expanded": {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isExpanded: !!this.expanded,
        name: "",
        message: "",
        editingDisplayName: false,
        submittingDisplayName: false,
        submitting: false,
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
        return this.name.length === 0;
      },
      invalidMessage() {
        return this.message.length === 0;
      }
    },
    methods: {
      onFocus(event) {
        this.isExpanded = true;
        this.$nextTick(() => {
          event.target.focus()
        });
      },
      editDisplayName() {
        this.name = useAuthStore().displayNameWithFallback;
        this.editingDisplayName = true;
      },
      async submitDisplayName() {
        this.submittingDisplayName = true;

        const data = {
          displayName: this.name
        };
        const user = await this.$api(`user/display-name`, useFetchOptsPost(data))
        this.editingDisplayName = false;
        this.submittingDisplayName = false;
        useAuthStore().setUser(user);
        this.$emit('displayNameChanged');
      },
      async submit() {
        this.submitting = true;

        const data = {
          message: this.message
        };
        await this.$api(`comment`, useFetchOptsPost(data))
        this.submitting = false;
        this.message = '';
        this.$emit('submitted');
      }
    }
  }
</script>

<style lang="scss" scoped>
  @use "../../assets/styleConfig";

  .d-flex {
    align-items: center;
  }

  div.commentForm {
    padding: 0.3em 1em;
    margin: 0.7em 3em;

    div.commentHeader {
      margin-bottom: 0.2em;

      span.name {
        font-weight: bold;
      }

      span.changeName {
        margin-left: 1em;
        color: #888;
        font-size: 80%;
      }
    }

    div.changeDisplayNameInfo {
      margin-top: 0.5em;
      font-style: italic;
      color: #888;
    }
  }
</style>
